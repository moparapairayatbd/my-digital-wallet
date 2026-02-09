

# Full Mobile Redesign and New Feature Screens

## Overview
Complete mobile-first redesign of the Nitrozix e-wallet with improved responsiveness, a modern app-like feel, and additional feature screens to make the prototype comprehensive.

## 1. Mobile-First Layout Redesign

### Header (Layout.tsx)
- Redesign mobile header: larger logo area, gradient-tinted status bar style
- Add a welcome text snippet or user greeting in header on mobile
- Notification bell with unread count badge (animated dot)
- Ensure header shrinks/blurs on scroll for more content space

### Bottom Navigation (BottomNav.tsx)
- Redesign with a floating pill-style bottom bar with rounded corners and shadow
- Center QR Scan button as a raised/floating action button (FAB) with gradient background
- Add subtle active indicator (dot or filled background) instead of just color change
- Improve the "More" sheet with categorized sections (Money, Payments, Banking, More)

### Sidebar (AppSidebar.tsx)
- Keep desktop sidebar as-is (already works well)
- Ensure sidebar trigger is hidden on mobile (bottom nav takes over)

## 2. Dashboard Redesign (Dashboard.tsx)

### Balance Card
- Full-width edge-to-edge on mobile (negative margin to bleed into edges)
- Add animated gradient background with floating shapes
- Add "Send" and "Receive" quick buttons directly on the balance card
- Show account number with copy button

### Quick Actions Grid
- Redesign as a 2-row horizontal scroll on mobile (instead of 4x2 grid)
- Larger icons with label below, subtle shadow on each action pill
- Add animated micro-interactions on tap

### "My Banking" Section (NEW)
- Horizontal scrollable card carousel showing user's cards
- Small currency account summary tiles
- "Manage" links to respective pages

### Spending Insights Widget (NEW)
- Mini donut/ring chart showing spending by category
- Top 3 spending categories with colored bars
- "This month" vs "Last month" comparison

### Recent Activity
- Redesign transaction rows with larger tap targets for mobile
- Add transaction category icons (different icon per type)
- Swipe hint for "See All"

### Offers Section
- Full-width promotional banner cards with gradient backgrounds
- Auto-scroll carousel with dots indicator

## 3. New Feature Screens

### Profile Page (NEW - /profile)
- User avatar with edit option
- Personal details display (name, phone, email, NID)
- KYC verification status badge
- Account tier display (Basic/Premium)
- Linked bank accounts list
- Referral code section

### Rewards and Points (NEW - /rewards)
- Points balance display with animated counter
- Tier progress bar (Bronze/Silver/Gold/Platinum)
- Redeemable rewards catalog (data/airtime/cashback)
- Points history list
- How to earn more points section

### Refer and Earn (NEW - /refer)
- Referral code with copy and share buttons
- Referral statistics (invited count, earned amount)
- How it works steps
- Leaderboard preview

### Statements and Reports (NEW - /statements)
- Monthly statement cards with download button
- Date range picker for custom reports
- Summary stats (total in, total out, net)
- Export options (PDF mock)

### Security Center (NEW - /security)
- PIN change mock flow
- Biometric toggle
- Active sessions list
- Login history
- Two-factor authentication toggle
- Block/report options

### Help and Support (NEW - /support)
- FAQ accordion sections
- Live chat placeholder
- Call support button
- Email support form
- Popular topics grid

## 4. Existing Page Improvements

### All Transaction Pages (Send, Receive, Request, etc.)
- Improve mobile spacing and touch targets
- Add back button with page title in a consistent header bar
- Larger input fields (h-14 minimum) for mobile
- Amount input with larger font and currency symbol prefix
- Add quick amount buttons (500, 1000, 2000, 5000)

### Cards Page
- Horizontal card carousel with swipe on mobile
- Card details shown below selected card
- Larger card render on mobile (full width)

### Transaction History
- Add date range selector
- Pull-to-refresh visual hint
- Group transactions by date with sticky date headers

### Settings Page
- Reorganize into sections with icons
- Add profile photo section at top
- Add logout button
- Add app version info at bottom

## 5. Global Mobile Improvements

### CSS/Styling (index.css)
- Add safe-area-inset padding for modern phones (notch support)
- Smooth page transition animation class
- Touch-friendly minimum heights (44px tap targets)
- Improve scroll behavior (smooth scrolling, overscroll bounce)
- Add subtle skeleton loading states

### Responsive Breakpoints
- Ensure all pages use full width on mobile (no max-w-md restriction)
- Cards and grids stack vertically on small screens
- Text sizes adjust for mobile readability

## Technical Approach

### Files to Create
- `src/pages/Profile.tsx` - User profile page
- `src/pages/Rewards.tsx` - Rewards and points system
- `src/pages/ReferEarn.tsx` - Referral program
- `src/pages/Statements.tsx` - Account statements
- `src/pages/SecurityCenter.tsx` - Security settings
- `src/pages/HelpSupport.tsx` - Help and FAQ

### Files to Modify
- `src/components/Layout.tsx` - Improved mobile header
- `src/components/BottomNav.tsx` - Floating pill design with FAB
- `src/pages/Dashboard.tsx` - Full redesign with new sections
- `src/pages/Cards.tsx` - Mobile card carousel
- `src/pages/Settings.tsx` - Enhanced settings
- `src/pages/TransactionHistory.tsx` - Date headers and filters
- `src/App.tsx` - New routes
- `src/components/AppSidebar.tsx` - New menu items
- `src/index.css` - Mobile-first utility classes
- `src/data/mockData.ts` - Additional mock data for new features

### Data Additions
- Rewards/points mock data
- Referral statistics
- FAQ content
- Security settings state
- Spending categories breakdown

