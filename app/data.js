// HomeLedger — one household, one month, one source of truth.
// The Alvarez family, November 2026. Every figure on every page is computed
// from the transactions below, so the totals can never drift apart.
// "Today" is fixed at Thursday, November 26, 2026 (no Date.now()): the site
// renders identically every time it is opened.

export const HOUSEHOLD = {
  name: 'The Alvarez Family',
  members: 'Maya & Daniel Alvarez · Sofia (9) · Leo (6)',
  month: 'November 2026',
  today: 'Thursday, November 26, 2026',
  daysLeft: 4,
  currency: 'USD',
};

export const INCOME = [
  { date: '2026-11-01', source: 'Maya Alvarez — salary (Nov 1)', amount: 3900 },
  { date: '2026-11-15', source: 'Daniel Alvarez — salary (Nov 15)', amount: 2950 },
];

// limit = the monthly budget for the category; spent is always the sum of
// that category's transactions, never a hand-typed number.
export const CATEGORIES = [
  { id: 'housing', label: 'Housing', limit: 1850, kind: 'need' },
  { id: 'groceries', label: 'Groceries', limit: 700, kind: 'need' },
  { id: 'dining', label: 'Dining out', limit: 300, kind: 'want' },
  { id: 'transport', label: 'Transport', limit: 560, kind: 'need' },
  { id: 'utilities', label: 'Utilities', limit: 380, kind: 'need' },
  { id: 'kids', label: 'Kids & school', limit: 400, kind: 'need' },
  { id: 'entertainment', label: 'Entertainment', limit: 220, kind: 'want' },
  { id: 'health', label: 'Health', limit: 200, kind: 'need' },
  { id: 'clothing', label: 'Clothing', limit: 150, kind: 'want' },
  { id: 'personal', label: 'Personal care', limit: 180, kind: 'want' },
  { id: 'subscriptions', label: 'Subscriptions', limit: 120, kind: 'want' },
  { id: 'misc', label: 'Household & misc', limit: 150, kind: 'want' },
];

// 54 expense rows + 2 paydays. Per-category sums (verified by hand):
// housing 1850 · groceries 612 · dining 248 · transport 528 · utilities 332
// kids 342 · entertainment 186 · health 128 · clothing 96 · personal 152
// subscriptions 87 · misc 113 — total spent $4,674 of $6,850 income.
export const TRANSACTIONS = [
  { date: '2026-11-01', payee: 'Maple Grove Apartments', category: 'housing', amount: 1850.00, note: 'Monthly rent' },
  { date: '2026-11-01', payee: 'Maya Alvarez — salary', category: 'income', amount: 3900.00, note: 'Payday' },
  { date: '2026-11-02', payee: 'Whole Foods', category: 'groceries', amount: 148.20, note: 'Weekly shop' },
  { date: '2026-11-02', payee: 'Netflix', category: 'subscriptions', amount: 15.49, note: 'Monthly' },
  { date: '2026-11-02', payee: 'Spotify', category: 'subscriptions', amount: 11.99, note: 'Family plan' },
  { date: '2026-11-03', payee: 'Olive Garden', category: 'dining', amount: 64.80, note: 'Family dinner' },
  { date: '2026-11-03', payee: 'CVS Pharmacy', category: 'health', amount: 38.40, note: 'Prescriptions' },
  { date: '2026-11-04', payee: 'Shell', category: 'transport', amount: 52.00, note: 'Fuel' },
  { date: '2026-11-05', payee: 'City Power', category: 'utilities', amount: 86.40, note: 'Electric bill' },
  { date: '2026-11-05', payee: 'Haircut — Maya', category: 'personal', amount: 48.00, note: 'Salon' },
  { date: '2026-11-06', payee: "Trader Joe's", category: 'groceries', amount: 96.45, note: 'Weekly shop' },
  { date: '2026-11-06', payee: 'iCloud', category: 'subscriptions', amount: 2.99, note: 'Storage' },
  { date: '2026-11-06', payee: 'School lunch — Sofia & Leo', category: 'kids', amount: 45.00, note: 'Lunch money' },
  { date: '2026-11-07', payee: 'AMC Theatres', category: 'entertainment', amount: 42.00, note: 'Family movie' },
  { date: '2026-11-07', payee: 'Metro top-up', category: 'transport', amount: 34.00, note: 'Transit card' },
  { date: '2026-11-08', payee: 'Chipotle', category: 'dining', amount: 38.25, note: 'Lunch' },
  { date: '2026-11-08', payee: 'FiberNet', category: 'utilities', amount: 79.00, note: 'Internet' },
  { date: '2026-11-08', payee: 'Amazon', category: 'misc', amount: 41.20, note: 'Household items' },
  { date: '2026-11-09', payee: 'Costco', category: 'groceries', amount: 187.30, note: 'Bulk shop — biggest of the month' },
  { date: '2026-11-09', payee: 'Target', category: 'clothing', amount: 54.25, note: 'Kids’ clothes' },
  { date: '2026-11-09', payee: 'FitLife Gym', category: 'subscriptions', amount: 34.99, note: 'Membership' },
  { date: '2026-11-10', payee: 'Kids’ shoes', category: 'kids', amount: 89.99, note: 'Sofia — new shoes' },
  { date: '2026-11-10', payee: 'Dentist copay', category: 'health', amount: 45.00, note: 'Leo — checkup' },
  { date: '2026-11-11', payee: 'Shell', category: 'transport', amount: 48.50, note: 'Fuel' },
  { date: '2026-11-11', payee: 'Salon — Daniel', category: 'personal', amount: 65.00, note: 'Haircut & shave' },
  { date: '2026-11-12', payee: 'Pizza delivery', category: 'dining', amount: 29.40, note: 'Friday pizza night' },
  { date: '2026-11-12', payee: 'Concert tickets', category: 'entertainment', amount: 98.00, note: 'Two tickets' },
  { date: '2026-11-13', payee: 'Tutoring — Sofia', category: 'kids', amount: 120.00, note: 'Math, 4 sessions' },
  { date: '2026-11-14', payee: 'Whole Foods', category: 'groceries', amount: 84.15, note: 'Weekly shop' },
  { date: '2026-11-14', payee: 'Uber', category: 'transport', amount: 22.75, note: 'Ride home' },
  { date: '2026-11-15', payee: 'Daniel Alvarez — salary', category: 'income', amount: 2950.00, note: 'Payday' },
  { date: '2026-11-15', payee: 'City Water', category: 'utilities', amount: 48.60, note: 'Water bill' },
  { date: '2026-11-15', payee: 'Sushi date night', category: 'dining', amount: 72.10, note: 'Maya & Daniel' },
  { date: '2026-11-15', payee: 'Audible', category: 'subscriptions', amount: 14.95, note: 'Audiobooks' },
  { date: '2026-11-16', payee: 'Hardware store', category: 'misc', amount: 28.75, note: 'Light bulbs & tape' },
  { date: '2026-11-17', payee: 'Vitamins', category: 'health', amount: 22.60, note: 'Pharmacy' },
  { date: '2026-11-18', payee: 'Shell', category: 'transport', amount: 55.00, note: 'Fuel' },
  { date: '2026-11-18', payee: 'Uniqlo', category: 'clothing', amount: 41.75, note: 'Winter layers' },
  { date: '2026-11-18', payee: 'Mobile carrier', category: 'utilities', amount: 118.00, note: 'Two lines' },
  { date: '2026-11-19', payee: "Trader Joe's", category: 'groceries', amount: 52.60, note: 'Top-up shop' },
  { date: '2026-11-19', payee: 'Board game', category: 'entertainment', amount: 28.50, note: 'Family game night' },
  { date: '2026-11-20', payee: 'School supplies', category: 'kids', amount: 52.01, note: 'Notebooks & pens' },
  { date: '2026-11-20', payee: 'Skincare', category: 'personal', amount: 39.00, note: 'Drugstore' },
  { date: '2026-11-21', payee: 'Chipotle', category: 'dining', amount: 27.45, note: 'Lunch' },
  { date: '2026-11-21', payee: 'Parking', category: 'transport', amount: 18.00, note: 'Downtown garage' },
  { date: '2026-11-21', payee: 'Cloud storage', category: 'subscriptions', amount: 6.59, note: 'Photo backup' },
  { date: '2026-11-22', payee: 'SafeDrive car insurance', category: 'transport', amount: 142.00, note: 'Monthly premium' },
  { date: '2026-11-22', payee: 'Piano lesson — Sofia', category: 'kids', amount: 35.00, note: 'Weekly lesson' },
  { date: '2026-11-23', payee: 'Costco', category: 'groceries', amount: 43.30, note: 'Top-up shop' },
  { date: '2026-11-23', payee: 'Streaming rental', category: 'entertainment', amount: 17.50, note: 'Movie night' },
  { date: '2026-11-24', payee: 'Shell', category: 'transport', amount: 61.25, note: 'Fuel' },
  { date: '2026-11-24', payee: 'Coffee shop', category: 'dining', amount: 16.00, note: 'Two lattes' },
  { date: '2026-11-24', payee: 'CVS Pharmacy', category: 'health', amount: 22.00, note: 'Cold medicine' },
  { date: '2026-11-25', payee: 'Uber', category: 'transport', amount: 19.50, note: 'Airport ride' },
  { date: '2026-11-25', payee: 'Gift — Grandma', category: 'misc', amount: 43.05, note: 'Birthday gift' },
  { date: '2026-11-26', payee: 'Metro monthly pass', category: 'transport', amount: 75.00, note: 'December pass' },
];

// Bills: paid ones match a transaction above. Paid total $2,404.41.
// Still to go in November: home insurance $96 (OVERDUE, card expired),
// Visa minimum $486 (Nov 28), auto loan $312 (Nov 30) — $894.00.
export const BILLS = [
  { name: 'Rent — Maple Grove Apartments', amount: 1850.00, due: '2026-11-01', status: 'paid', detail: 'Paid Nov 1' },
  { name: 'Netflix', amount: 15.49, due: '2026-11-02', status: 'paid', detail: 'Paid Nov 2' },
  { name: 'Spotify — family plan', amount: 11.99, due: '2026-11-02', status: 'paid', detail: 'Paid Nov 2' },
  { name: 'City Power', amount: 86.40, due: '2026-11-05', status: 'paid', detail: 'Paid Nov 5' },
  { name: 'iCloud storage', amount: 2.99, due: '2026-11-06', status: 'paid', detail: 'Paid Nov 6' },
  { name: 'FiberNet internet', amount: 79.00, due: '2026-11-08', status: 'paid', detail: 'Paid Nov 8' },
  { name: 'FitLife Gym', amount: 34.99, due: '2026-11-09', status: 'paid', detail: 'Paid Nov 9' },
  { name: 'Audible', amount: 14.95, due: '2026-11-15', status: 'paid', detail: 'Paid Nov 15' },
  { name: 'City Water', amount: 48.60, due: '2026-11-15', status: 'paid', detail: 'Paid Nov 15' },
  { name: 'Mobile carrier — 2 lines', amount: 118.00, due: '2026-11-18', status: 'paid', detail: 'Paid Nov 18' },
  { name: 'SafeDrive car insurance', amount: 142.00, due: '2026-11-22', status: 'paid', detail: 'Paid Nov 22' },
  { name: 'Home insurance', amount: 96.00, due: '2026-11-25', status: 'overdue', detail: 'Card expired — update payment' },
  { name: 'Visa — minimum payment', amount: 486.00, due: '2026-11-28', status: 'upcoming', detail: 'Due in 2 days' },
  { name: 'Auto loan', amount: 312.00, due: '2026-11-30', status: 'upcoming', detail: 'Due in 4 days' },
];

export const GOALS = [
  { id: 'emergency', name: 'Emergency fund', saved: 8450, target: 12000, note: '6 months of essentials' },
  { id: 'vacation', name: 'Family vacation', saved: 1875, target: 3200, note: 'Beach trip next summer' },
  { id: 'car', name: 'New car down payment', saved: 2300, target: 6000, note: 'Replace the 2014 sedan' },
  { id: 'college', name: 'Kids’ college fund', saved: 4120, target: 25000, note: 'Sofia & Leo, started 2024' },
];

// Monthly spending, June–October, with November computed live from state.
export const HISTORY = [
  { month: 'Jun', spent: 4180 },
  { month: 'Jul', spent: 4352 },
  { month: 'Aug', spent: 4097 },
  { month: 'Sep', spent: 4521 },
  { month: 'Oct', spent: 4298 },
];

export const HABITS = [
  { title: 'Save on payday, not at month-end', text: 'Move $500 to savings the morning each paycheck lands — before it can be spent. November’s $2,176 saved started with two $500 moves.' },
  { title: 'Shop with a weekly list', text: 'One planned shop a week plus one top-up. The Alvarez family’s biggest single shop was Costco, $187.30 on Nov 9 — planned, not impulse.' },
  { title: 'Check autopay before it fires', text: 'A card expired on Nov 25 and the $96 home-insurance payment bounced. A two-minute check on the 24th would have caught it.' },
  { title: 'Give every dollar a job', text: 'Needs $3,792, wants $882, savings $2,176. When the split is written down, the month stops leaking.' },
  { title: 'One money date a month', text: 'Thirty minutes, last Sunday of the month: review the bars, move the leftover, set next month’s limits. November’s date is Nov 29.' },
];
