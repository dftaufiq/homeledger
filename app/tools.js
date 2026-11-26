// HomeLedger tools — three calculators. Pure math first, DOM wiring second,
// so the numbers are testable without a browser.

// 50/30/20 split of a monthly take-home pay.
export function plan503020(income) {
  return { needs: income * 0.5, wants: income * 0.3, savings: income * 0.2 };
}

// Debt payoff: fixed monthly payment against a balance at an APR.
// Returns months to freedom and total interest, simulating month by month
// (the last payment is smaller than the scheduled one).
export function debtPayoff(balance, aprPercent, payment) {
  const r = aprPercent / 100 / 12;
  if (payment <= balance * r) return { months: Infinity, interest: Infinity };
  let remaining = balance, interest = 0, months = 0;
  while (remaining > 0 && months < 1200) {
    const interestThisMonth = remaining * r;
    interest += interestThisMonth;
    remaining += interestThisMonth;
    const paid = Math.min(payment, remaining);
    remaining -= paid;
    months += 1;
  }
  return { months, interest };
}

// Savings goal: months from today (Nov 2026) to reach a target at a fixed
// monthly contribution, and the month it lands in.
export function savingsGoal(target, saved, monthly) {
  const remaining = Math.max(0, target - saved);
  if (remaining === 0) return { months: 0, lands: 'November 2026' };
  if (monthly <= 0) return { months: Infinity, lands: '—' };
  const months = Math.ceil(remaining / monthly);
  const names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const start = new Date(2026, 10, 26); // fixed "today": November 2026
  const lands = new Date(start.getFullYear(), start.getMonth() + months, 1);
  return { months, lands: names[lands.getMonth()] + ' ' + lands.getFullYear() };
}

export function monthName(monthsAhead) {
  const names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const start = new Date(2026, 10, 26);
  const d = new Date(start.getFullYear(), start.getMonth() + monthsAhead, 1);
  return names[d.getMonth()] + ' ' + d.getFullYear();
}
