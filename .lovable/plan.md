
# Strowallet Virtual Card Integration

## Overview
Replace the current mock card generation (random numbers) with real Strowallet API calls for creating, funding, fetching, and managing virtual Visa cards. The Strowallet API key (public_key) will be stored securely as a backend secret and all API calls will go through a backend function to keep credentials safe.

## Prerequisites -- API Key Setup
Before implementation, you will need to provide your **Strowallet Public Key**. This is found in your Strowallet dashboard under API settings. The key will be stored securely and never exposed to the browser.

## What Changes

### 1. Backend Function: `strowallet-proxy`
A single backend function that proxies all Strowallet API calls securely. It will handle these operations:

- **create-customer** -- Register a Nitrozix user as a Strowallet customer (first-time card creation)
- **create-card** -- Issue a new virtual Visa card via Strowallet
- **fund-card** -- Add funds to an existing card
- **fetch-card-detail** -- Get card details (number, CVV, expiry) from Strowallet
- **card-transactions** -- Fetch transaction history for a card
- **freeze-card** -- Freeze/unfreeze a card

The function reads the `STROWALLET_PUBLIC_KEY` secret and forwards requests to `https://strowallet.com/api/bitvcard/...` endpoints.

### 2. Database Changes
Add a column to the `cards` table to store the Strowallet-issued card ID:
- `strowallet_card_id TEXT` -- maps our card record to the Strowallet card

Add a column to `profiles` to track Strowallet customer registration:
- `strowallet_customer_id TEXT` -- so we don't re-register users

### 3. Cards Page Updates (`src/pages/Cards.tsx`)
The card creation flow stays visually the same (5-step wizard), but the "Create Card" action now calls the backend function instead of generating random numbers. The flow becomes:

1. User picks card type, design, enters info (same UI)
2. On "Create Card" click, the backend function:
   - Checks if user has a Strowallet customer ID; if not, creates one via `create-user/`
   - Calls `create-card/` with `name_on_card`, `card_type: "visa"`, `amount: "1"` (minimum prefund)
   - Returns the real card details (card_id, masked number, expiry)
3. Card details are saved to the `cards` table with the `strowallet_card_id`
4. Success screen shows the real card

### 4. Hook Updates (`src/hooks/useWallet.ts`)
- **`useCreateCard`** -- Instead of generating random card numbers, calls the `strowallet-proxy` backend function
- **`useFundCard`** (new) -- Calls fund-card endpoint to add balance to a Strowallet card
- **`useFreezeCard`** (new) -- Calls freeze/unfreeze endpoint
- **`useCardDetails`** (new) -- Fetches real card details (full number, CVV) on demand

### 5. Card Controls Enhancement
- **Show/Hide Details** button will fetch real card details from Strowallet API on demand (not stored locally for security)
- **Freeze/Unfreeze** will call the Strowallet freeze endpoint
- **Fund Card** button added to allow topping up card balance

## Architecture Flow

```text
Browser (Cards.tsx)
    |
    | POST /strowallet-proxy { action: "create-card", ... }
    v
Backend Function (strowallet-proxy)
    |
    | Uses STROWALLET_PUBLIC_KEY secret
    | POST https://strowallet.com/api/bitvcard/create-card/
    v
Strowallet API
    |
    | Returns card_id, masked_pan, expiry, etc.
    v
Backend Function
    |
    | Returns sanitized response
    v
Browser --> saves to cards table --> shows success
```

## Technical Details

### Backend Function Structure
```text
supabase/functions/strowallet-proxy/index.ts
```

Supported actions via POST body `{ action: "...", ... }`:
- `create-customer`: params (firstName, lastName, email, phone, dateOfBirth, idNumber, idType, address fields)
- `create-card`: params (name_on_card, card_type, amount, customerEmail)
- `fund-card`: params (card_id, amount)
- `fetch-card-detail`: params (card_id)
- `freeze-card`: params (card_id, action: "freeze"|"unfreeze")

### Database Migration
```text
ALTER TABLE cards ADD COLUMN strowallet_card_id TEXT;
ALTER TABLE profiles ADD COLUMN strowallet_customer_id TEXT;
```

### Security
- Strowallet public key stored as a backend secret, never exposed to the frontend
- All API calls routed through the backend function
- User authentication required for all operations
- Card CVV/full number fetched on-demand and never persisted in the database

## Files to Create/Modify
| File | Action |
|------|--------|
| `supabase/functions/strowallet-proxy/index.ts` | Create -- proxy for all Strowallet API calls |
| `src/hooks/useWallet.ts` | Modify -- update useCreateCard, add useFundCard, useFreezeCard, useCardDetails |
| `src/pages/Cards.tsx` | Modify -- wire create flow to backend, add fund card UI, wire freeze/unfreeze |
| Database migration | Add strowallet_card_id to cards, strowallet_customer_id to profiles |

## Steps
1. Request the Strowallet Public Key secret from you
2. Run database migration to add new columns
3. Create the `strowallet-proxy` backend function
4. Update `useCreateCard` hook to call the backend function
5. Add `useFundCard`, `useFreezeCard`, `useCardDetails` hooks
6. Update Cards.tsx to use real API responses and add fund card functionality
