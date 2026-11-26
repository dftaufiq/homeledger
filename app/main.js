// HomeLedger main — state, hash router, and every control's wiring.
// The state is built once from data.js; every figure on every page is
// derived from it, so the site can never show two different totals.
import { HOUSEHOLD, INCOME, CATEGORIES, TRANSACTIONS, BILLS, GOALS, HISTORY } from './data.js';
import { renderDashboard, renderTransactions, renderBudgets, renderBills, renderGoals, renderTools } from './views.js';
import { plan503020, debtPayoff, savingsGoal } from './tools.js';
import { money0 } from './charts.js';

const app = document.getElementById('app');

// ---- state: one mutable copy of the data, with all totals derived ----
function buildState() {
  const categories = CATEGORIES.map((c) => ({ ...c, spent: 0 }));
  const byId = new Map(categories.map((c) => [c.id, c]));
  for (const t of TRANSACTIONS) {
    if (t.category !== 'income' && byId.has(t.category)) byId.get(t.category).spent += t.amount;
  }
  return {
    household: HOUSEHOLD,
    incomeTotal: INCOME.reduce((a, i) => a + i.amount, 0),
    categories,
    transactions: TRANSACTIONS.map((t) => ({ ...t })),
    bills: BILLS.map((b) => ({ ...b })),
    goals: GOALS.map((g) => ({ ...g })),
    history: HISTORY,
    txQuery: '',
    txCategory: 'all',
  };
}

const state = buildState();

function derive(s) {
  s.spentTotal = s.categories.reduce((a, c) => a + c.spent, 0);
  s.savedTotal = s.incomeTotal - s.spentTotal;
  s.savingsRate = s.incomeTotal > 0 ? s.savedTotal / s.incomeTotal : 0;
  s.limitTotal = s.categories.reduce((a, c) => a + c.limit, 0);
  s.budgetLeft = s.limitTotal - s.spentTotal;
  s.needsTotal = s.categories.filter((c) => c.kind === 'need').reduce((a, c) => a + c.spent, 0);
  s.wantsTotal = s.categories.filter((c) => c.kind === 'want').reduce((a, c) => a + c.spent, 0);
  s.subsTotal = s.categories.find((c) => c.id === 'subscriptions').spent;
  s.goalsSavedTotal = s.goals.reduce((a, g) => a + g.saved, 0);
  s.goalsTargetTotal = s.goals.reduce((a, g) => a + g.target, 0);
  const q = s.txQuery.trim().toLowerCase();
  s.filteredTransactions = s.transactions
    .filter((t) => (s.txCategory === 'all' ? true : t.category === s.txCategory))
    .filter((t) => !q || (t.payee + ' ' + (t.note || '') + ' ' + t.category).toLowerCase().includes(q))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

// ---- router ----
const ROUTES = {
  '': renderDashboard,
  'transactions': renderTransactions,
  'budgets': renderBudgets,
  'bills': renderBills,
  'goals': renderGoals,
  'tools': renderTools,
};

function currentRoute() {
  return (location.hash || '#/').replace(/^#\/?/, '').split('/')[0];
}

function render() {
  derive(state);
  const route = currentRoute();
  const view = ROUTES[route] || renderDashboard;
  app.innerHTML = view(state);
  document.querySelectorAll('nav a').forEach((a) => {
    a.classList.toggle('active', a.dataset.route === route);
  });
  window.scrollTo(0, 0);
  wire(route);
}

// ---- wiring: every control on every page does what it says ----
function wire(route) {
  if (route === 'transactions') {
    const search = document.getElementById('tx-search');
    const cat = document.getElementById('tx-category');
    if (search) search.addEventListener('input', () => { state.txQuery = search.value; render(); const el = document.getElementById('tx-search'); el.focus(); el.setSelectionRange(el.value.length, el.value.length); });
    if (cat) cat.addEventListener('change', () => { state.txCategory = cat.value; render(); });
    const form = document.getElementById('tx-add');
    if (form) form.addEventListener('submit', (e) => {
      e.preventDefault();
      const date = document.getElementById('tx-date').value;
      const payee = document.getElementById('tx-payee').value.trim();
      const category = document.getElementById('tx-cat').value;
      const amount = Number(document.getElementById('tx-amount').value);
      if (!payee || !(amount > 0)) return;
      state.transactions.push({ date, payee, category, amount, note: 'Added by you' });
      const c = state.categories.find((x) => x.id === category);
      if (c) c.spent += amount;
      render();
    });
  }

  if (route === 'budgets') {
    document.querySelectorAll('[data-limit-for]').forEach((input) => {
      input.addEventListener('change', () => {
        const c = state.categories.find((x) => x.id === input.dataset.limitFor);
        const v = Number(input.value);
        if (c && v >= 0) { c.limit = v; render(); }
      });
    });
  }

  if (route === 'bills') {
    document.querySelectorAll('[data-pay-bill]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const b = state.bills[Number(btn.dataset.payBill)];
        if (b) { b.status = 'paid'; b.detail = 'Paid Nov 26'; render(); }
      });
    });
  }

  if (route === 'goals') {
    document.querySelectorAll('[data-add-goal]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const g = state.goals[Number(btn.dataset.addGoal)];
        if (g) { g.saved = Math.min(g.target, g.saved + Number(btn.dataset.amount)); render(); }
      });
    });
    const form = document.getElementById('goal-add');
    if (form) form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('goal-name').value.trim();
      const target = Number(document.getElementById('goal-target').value);
      const saved = Number(document.getElementById('goal-saved').value) || 0;
      if (!name || !(target > 0)) return;
      state.goals.push({ id: 'g' + Date.now(), name, saved, target, note: 'Added by you' });
      render();
    });
  }

  if (route === 'tools') {
    const planIncome = document.getElementById('plan-income');
    if (planIncome) planIncome.addEventListener('input', () => {
      const p = plan503020(Number(planIncome.value) || 0);
      const out = document.getElementById('plan-result');
      if (out) out.innerHTML = `<div><span>Needs — 50%</span><strong>${money0(p.needs)}</strong></div><div><span>Wants — 30%</span><strong>${money0(p.wants)}</strong></div><div><span>Savings — 20%</span><strong>${money0(p.savings)}</strong></div>`;
    });
    const debtInputs = ['debt-balance', 'debt-apr', 'debt-payment'].map((id) => document.getElementById(id));
    const updateDebt = () => {
      const bal = Number(debtInputs[0].value) || 0;
      const apr = Number(debtInputs[1].value) || 0;
      const pay = Number(debtInputs[2].value) || 0;
      const d = debtPayoff(bal, apr, pay);
      const out = document.getElementById('debt-result');
      if (!out) return;
      if (!Number.isFinite(d.months)) {
        out.innerHTML = `<div><span>Months to debt-free</span><strong>Never — the payment does not cover the interest</strong></div>`;
      } else {
        const fast = debtPayoff(bal, apr, Math.max(pay * 1.6, pay + 150));
        out.innerHTML = `<div><span>Months to debt-free</span><strong>${d.months}</strong></div><div><span>Total interest</span><strong>$${d.interest.toLocaleString('en-US', { maximumFractionDigits: 0 })}</strong></div><div><span>Paying $${Math.max(pay * 1.6, pay + 150).toLocaleString('en-US')}/mo instead</span><strong>${fast.months} months · $${fast.interest.toLocaleString('en-US', { maximumFractionDigits: 0 })} interest</strong></div>`;
      }
    };
    debtInputs.forEach((el) => el && el.addEventListener('input', updateDebt));
    const goalInputs = ['goal-target-input', 'goal-saved-input', 'goal-monthly-input'].map((id) => document.getElementById(id));
    const updateGoal = () => {
      const g = savingsGoal(Number(goalInputs[0].value) || 0, Number(goalInputs[1].value) || 0, Number(goalInputs[2].value) || 0);
      const out = document.getElementById('goal-result');
      if (out) out.innerHTML = `<div><span>Months to go</span><strong>${Number.isFinite(g.months) ? g.months : '—'}</strong></div><div><span>Reached in</span><strong>${g.lands}</strong></div>`;
    };
    goalInputs.forEach((el) => el && el.addEventListener('input', updateGoal));
  }
}

window.addEventListener('hashchange', render);
render();
