

# Nitrozix E-Wallet Dashboard — Full UI Prototype

## Design Direction
- **Colorful & bold** design inspired by bKash/Nagad — vibrant gradients (pink/magenta primary), rounded cards, bold icons
- Light theme with colorful accent cards for balance, quick actions, and promotions
- Bangla/English language toggle in the header
- Mobile-first responsive layout with a sidebar for desktop

## Pages & Features

### 1. Dashboard (Home)
- Welcome greeting with user avatar
- **Balance card** with one-tap balance show/hide toggle
- **Quick action grid**: Send, Receive, Request, Add Money, Cash Out, Pay Bill, Recharge, QR Pay
- Recent transactions list (5 most recent)
- Promotional banners / offers carousel

### 2. Send Money
- Recipient phone number input with contact picker UI
- Amount input, reference field, confirmation screen with summary

### 3. Receive Money
- Display user's QR code and phone number for receiving
- Recent received transactions

### 4. Request Money
- Enter phone number and amount to request
- Pending requests list with status

### 5. Add Money
- Select source: Bank Account, Debit Card, Credit Card
- Mock form for card/bank details, amount entry, confirmation

### 6. Mobile Recharge
- Prepaid/Postpaid toggle
- Phone number, operator selection, amount/package selection

### 7. Pay Bills
- Category grid: Electricity, Gas, Water, Internet, Phone, TV, Credit Card
- Bill details form per category with mock payment flow

### 8. Merchant Payment
- QR scanner placeholder UI
- Merchant search and payment form

### 9. Cash Out
- Agent number input, amount entry
- Nearby agent points (mock map/list)

### 10. Transaction History
- Filterable list by date, type (send/receive/payment/cashout)
- Monthly summary cards with charts (income vs spending)

### 11. Financial Products
- **Savings Plans**: Weekly/monthly DPS cards with mock enrollment
- **Loans**: Nano credit offers with eligibility and apply button
- **Pay Later**: Installment options display
- **Remittance**: International fund receive form

### 12. Bank Transfer
- Transfer to bank account form (bank selection, account number, amount)

### 13. Education & Donations
- Institution search, fee payment form
- Donation categories with quick amounts

### 14. Offers & Lifestyle
- Cashback offers grid
- Ticket booking, food delivery, shopping — category cards linking to placeholder pages

### 15. Settings / Profile
- Language toggle (Bangla/English)
- Profile info display
- Notification preferences

## Navigation
- **Desktop**: Sidebar with grouped menu items (Money Services, Payments, Financial Products, More)
- **Mobile**: Bottom navigation bar with 5 key actions + "More" menu
- Active route highlighting throughout

## Data
- All mock/hardcoded data — no backend needed
- Realistic transaction amounts in BDT (৳)

