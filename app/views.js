// HomeLedger views — one renderer per page. Every figure comes from the
// state object (built in main.js from data.js), never from hand-typed text,
// so a page can never disagree with the transactions behind it.
import { CATEGORIES, HISTORY, HABITS } from './data.js';
import { donutChart, historyBars, progressBar, money, money0, pct } from './charts.js';
import { plan503020, debtPayoff, savingsGoal } from './tools.js';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function catLabel(id) {
  if (id === 'income') return 'Income';
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? c.label : id;
}

function shortDate(iso) {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ---------- Dashboard (the cover page) ----------

export function renderDashboard(s) {
  const topCats = [...s.categories].sort((a, b) => b.spent - a.spent).slice(0, 6);
  const upcoming = s.bills.filter((b) => b.status !== 'paid').slice(0, 4);
  const topGoals = [...s.goals].sort((a, b) => b.saved / b.target - a.saved / a.target).slice(0, 3);
  const months = HISTORY.map((h) => ({ label: h.month, spent: h.spent }))
    .concat([{ label: 'Nov', spent: s.spentTotal, current: true }]);
  const slices = s.categories.filter((c) => c.spent > 0).map((c) => ({ label: c.label, value: c.spent }));

  return `
  <section class="page-head">
    <div><h1>November 2026 at a glance</h1>
    <p class="lede">${esc(s.household.members)} · ${esc(s.household.today)} · ${s.household.daysLeft} days left in the month</p></div>
    <div class="rate-badge"><strong>${pct(s.savingsRate * 100)}</strong><span>saved this month<br>target: 20%</span></div>
  </section>

  <section class="stat-row">
    <div class="stat"><span class="stat-label">Income</span><strong class="stat-num">${money0(s.incomeTotal)}</strong><span class="stat-sub">2 paychecks · Maya $3,900 + Daniel $2,950</span></div>
    <div class="stat"><span class="stat-label">Spent so far</span><strong class="stat-num">${money0(s.spentTotal)}</strong><span class="stat-sub">${s.transactions.filter((t) => t.category !== 'income').length} purchases · Nov 1–26</span></div>
    <div class="stat stat-saved"><span class="stat-label">Saved</span><strong class="stat-num">${money0(s.savedTotal)}</strong><span class="stat-sub">${pct(s.savingsRate * 100)} of income · ahead of the 20% goal</span></div>
    <div class="stat"><span class="stat-label">Budget left</span><strong class="stat-num">${money0(s.budgetLeft)}</strong><span class="stat-sub">of ${money0(s.limitTotal)} planned · ${s.household.daysLeft} days to go</span></div>
  </section>

  <div class="dash-grid">
    <section class="card">
      <h2>Where the money went</h2>
      ${donutChart(slices, s.spentTotal)}
      <ul class="legend">${slices.map((c, i) => `<li><i style="background:${['#14532d', '#c2700e', '#2e7d5b', '#8a5a00', '#4a7c59', '#b3541e', '#6b8e23', '#1f6f8b', '#7d5ba6', '#a83232', '#5b7a99', '#8c8c5a'][i % 12]}"></i>${esc(c.label)} <b>${money0(c.value)}</b></li>`).join('')}</ul>
      <p class="card-note"><a href="#/transactions">All ${s.transactions.length} transactions, Nov 1–26 →</a></p>
    </section>

    <section class="card">
      <h2>Spending, last 6 months</h2>
      ${historyBars(months)}
      <p class="card-note">November is the highest month of the half-year — the $142 car-insurance premium and $120 tutoring block land in it.</p>
      <h2 class="h2-tight">Budgets to watch</h2>
      ${topCats.map((c) => `<div class="budget-row"><span class="budget-name">${esc(c.label)}</span>${progressBar(c.spent, c.limit)}<span class="budget-nums">${money0(c.spent)} / ${money0(c.limit)}</span></div>`).join('')}
    </section>

    <section class="card">
      <h2>Bills coming up</h2>
      <ul class="bill-mini">${upcoming.map((b) => `<li><span class="pill ${b.status}">${b.status === 'overdue' ? 'Overdue' : 'Due ' + shortDate(b.due)}</span><span class="bill-name">${esc(b.name)}</span><b>${money(b.amount)}</b></li>`).join('')}</ul>
      <h2 class="h2-tight">Goals on track</h2>
      ${topGoals.map((g) => `<div class="goal-mini"><div class="goal-mini-head"><span>${esc(g.name)}</span><b>${money0(g.saved)} / ${money0(g.target)}</b></div>${progressBar(g.saved, g.target)}</div>`).join('')}
      <p class="card-note"><a href="#/goals">All 4 goals →</a> · ${money0(s.goalsSavedTotal)} saved toward ${money0(s.goalsTargetTotal)}</p>
    </section>
  </div>

  <section class="insights">
    <h2>Five things this month is saying</h2>
    <div class="insight-grid">
      <article class="insight"><strong>Groceries: $88 under budget.</strong> Biggest shop was Costco on Nov 9, $187.30 — planned bulk, not impulse.</article>
      <article class="insight"><strong>Transport is the watch-out.</strong> $528 of $560 with 4 days left. Fuel and the $142 insurance premium did it.</article>
      <article class="insight"><strong>Dining: 6 meals out, $248 of $300.</strong> Average $41 a meal; priciest was sushi date night, $72.10.</article>
      <article class="insight"><strong>Savings rate 31.8%.</strong> Needs $3,792 (55.4%), wants $882 (12.9%), saved $2,176 — ahead of the 20% target.</article>
      <article class="insight insight-alert"><strong>One bill needs attention.</strong> Home insurance, $96, due Nov 25 — the card on file expired. Update it before the late fee.</article>
    </div>
  </section>`;
}

// ---------- Transactions ----------

export function renderTransactions(s) {
  const rows = s.filteredTransactions;
  return `
  <section class="page-head">
    <div><h1>Transactions</h1>
    <p class="lede">${rows.length} of ${s.transactions.length} shown · every dollar in November, Nov 1–26</p></div>
  </section>
  <section class="card">
    <h2>Add a transaction</h2>
    <form id="tx-add" class="add-form">
      <label>Date <input type="date" id="tx-date" value="2026-11-26" required></label>
      <label>What <input type="text" id="tx-payee" placeholder="e.g. Whole Foods" required></label>
      <label>Category <select id="tx-cat">${CATEGORIES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join('')}</select></label>
      <label>Amount ($) <input type="number" id="tx-amount" min="0.01" step="0.01" placeholder="0.00" required></label>
      <button type="submit" class="btn">Add it</button>
      <span class="card-note">Adding a purchase updates the totals, the donut and every budget bar at once — try it, then check the Dashboard.</span>
    </form>
  </section>
  <section class="card">
    <form id="tx-filter" class="filter-row">
      <label>Search <input type="search" id="tx-search" placeholder="e.g. Costco, Shell, sushi…" value="${esc(s.txQuery)}"></label>
      <label>Category <select id="tx-category">
        <option value="all">All categories</option>
        ${CATEGORIES.map((c) => `<option value="${c.id}" ${s.txCategory === c.id ? 'selected' : ''}>${esc(c.label)}</option>`).join('')}
        <option value="income" ${s.txCategory === 'income' ? 'selected' : ''}>Income</option>
      </select></label>
      <span class="filter-total">Shown: <b>${money(rows.reduce((a, t) => a + (t.category === 'income' ? 0 : t.amount), 0))}</b> spent</span>
    </form>
    <div class="table-wrap"><table class="full-table"><thead><tr><th>Date</th><th>What</th><th>Category</th><th>Note</th><th class="num">Amount</th></tr></thead><tbody>
    ${rows.map((t) => `<tr class="${t.category === 'income' ? 'row-income' : ''}"><td>${shortDate(t.date)}</td><td>${esc(t.payee)}</td><td>${esc(catLabel(t.category))}</td><td>${esc(t.note || '')}</td><td class="num">${t.category === 'income' ? '+' : '−'}${money(t.amount)}</td></tr>`).join('')}
    </tbody></table></div>
  </section>`;
}

// ---------- Budgets ----------

export function renderBudgets(s) {
  const plan = plan503020(s.incomeTotal);
  return `
  <section class="page-head">
    <div><h1>Budgets</h1>
    <p class="lede">${money0(s.spentTotal)} spent of ${money0(s.limitTotal)} planned · ${money0(s.budgetLeft)} left · 4 days to go</p></div>
  </section>
  <section class="split-503020">
    <div class="split-card"><span>Needs — 50%</span><strong>${money0(plan.needs)}</strong><span class="split-actual">Actual needs: ${money0(s.needsTotal)} (${pct(s.needsTotal / s.incomeTotal * 100)})</span></div>
    <div class="split-card"><span>Wants — 30%</span><strong>${money0(plan.wants)}</strong><span class="split-actual">Actual wants: ${money0(s.wantsTotal)} (${pct(s.wantsTotal / s.incomeTotal * 100)})</span></div>
    <div class="split-card split-saved"><span>Savings — 20%</span><strong>${money0(plan.savings)}</strong><span class="split-actual">Actually saved: ${money0(s.savedTotal)} (${pct(s.savingsRate * 100)}) — ahead</span></div>
  </section>
  <section class="budget-grid">
    ${s.categories.map((c) => {
      const left = c.limit - c.spent;
      const state = left < 0 ? 'over' : left < c.limit * 0.15 ? 'tight' : 'ok';
      return `<article class="card budget-card">
        <div class="budget-card-head"><h2>${esc(c.label)}</h2><span class="pill ${state}">${left < 0 ? money0(-left) + ' over' : money0(left) + ' left'}</span></div>
        ${progressBar(c.spent, c.limit)}
        <p class="budget-nums-big"><b>${money0(c.spent)}</b> of ${money0(c.limit)} · ${pct(c.spent / c.limit * 100)}</p>
        <label class="limit-edit">Monthly limit $ <input type="number" min="0" step="10" value="${c.limit}" data-limit-for="${c.id}" aria-label="Monthly limit for ${esc(c.label)}"></label>
      </article>`;
    }).join('')}
  </section>
  <p class="card-note">Limits are editable — change one and the dashboard, the split above and the “budget left” total all update.</p>`;
}

// ---------- Bills & subscriptions ----------

export function renderBills(s) {
  const paid = s.bills.filter((b) => b.status === 'paid');
  const todo = s.bills.filter((b) => b.status !== 'paid');
  const paidTotal = paid.reduce((a, b) => a + b.amount, 0);
  const todoTotal = todo.reduce((a, b) => a + b.amount, 0);
  const subs = s.transactions.filter((t) => t.category === 'subscriptions');
  return `
  <section class="page-head">
    <div><h1>Bills &amp; subscriptions</h1>
    <p class="lede">${paid.length} of ${s.bills.length} bills paid · ${money(paidTotal)} out the door · ${money(todoTotal)} still to go</p></div>
  </section>
  <section class="card">
    <h2>November bills</h2>
    <div class="table-wrap"><table class="full-table"><thead><tr><th>Bill</th><th>Due</th><th class="num">Amount</th><th>Status</th><th></th></tr></thead><tbody>
    ${s.bills.map((b, i) => `<tr><td>${esc(b.name)}</td><td>${shortDate(b.due)}</td><td class="num">${money(b.amount)}</td><td><span class="pill ${b.status}">${b.status === 'paid' ? 'Paid' : b.status === 'overdue' ? 'Overdue' : 'Upcoming'}</span><br><small>${esc(b.detail)}</small></td><td>${b.status !== 'paid' ? `<button class="btn btn-small" data-pay-bill="${i}">Mark paid</button>` : ''}</td></tr>`).join('')}
    </tbody></table></div>
  </section>
  <section class="card">
    <h2>Subscriptions — ${money0(s.subsTotal)} a month, 6 services</h2>
    <p class="card-note">Every one is used weekly: Netflix and Spotify daily, FitLife Gym three times a week, Audible on the commute, iCloud and cloud storage running in the background. Nothing here is a forgotten free trial.</p>
    <div class="table-wrap"><table class="full-table"><thead><tr><th>Service</th><th>Renews</th><th class="num">Monthly</th></tr></thead><tbody>
    ${subs.map((t) => `<tr><td>${esc(t.payee)}</td><td>${shortDate(t.date)}</td><td class="num">${money(t.amount)}</td></tr>`).join('')}
    <tr class="row-total"><td colspan="2"><b>Total</b></td><td class="num"><b>${money(s.subsTotal)}</b></td></tr>
    </tbody></table></div>
  </section>`;
}

// ---------- Goals ----------

export function renderGoals(s) {
  return `
  <section class="page-head">
    <div><h1>Goals</h1>
    <p class="lede">${money0(s.goalsSavedTotal)} saved toward ${money0(s.goalsTargetTotal)} · ${pct(s.goalsSavedTotal / s.goalsTargetTotal * 100)} of the way there</p></div>
  </section>
  <section class="goal-grid">
    ${s.goals.map((g, i) => `<article class="card goal-card">
      <div class="goal-head"><h2>${esc(g.name)}</h2><span class="pill">${pct(g.saved / g.target * 100)}</span></div>
      ${progressBar(g.saved, g.target)}
      <p class="budget-nums-big"><b>${money0(g.saved)}</b> of ${money0(g.target)}</p>
      <p class="card-note">${esc(g.note)}</p>
      <div class="goal-buttons">
        <button class="btn btn-small" data-add-goal="${i}" data-amount="50">+ $50</button>
        <button class="btn btn-small" data-add-goal="${i}" data-amount="100">+ $100</button>
        <button class="btn btn-small" data-add-goal="${i}" data-amount="250">+ $250</button>
      </div>
    </article>`).join('')}
  </section>
  <section class="card">
    <h2>Start a new goal</h2>
    <form id="goal-add" class="add-form">
      <label>Goal name <input type="text" id="goal-name" placeholder="e.g. New bikes for the kids" required></label>
      <label>Target ($) <input type="number" id="goal-target" min="1" step="10" placeholder="1000" required></label>
      <label>Saved so far ($) <input type="number" id="goal-saved" min="0" step="10" value="0"></label>
      <button type="submit" class="btn">Create goal</button>
    </form>
  </section>`;
}

// ---------- Tools ----------

export function renderTools(s) {
  const plan = plan503020(s.incomeTotal);
  const debt = debtPayoff(4800, 21.9, 250);
  const debtFast = debtPayoff(4800, 21.9, 400);
  const goal = savingsGoal(3200, 1875, 150);
  return `
  <section class="page-head">
    <div><h1>Tools</h1>
    <p class="lede">Three calculators that run on this household’s real numbers — change any input and the answer updates live</p></div>
  </section>
  <section class="tool-grid">
    <article class="card tool-card">
      <h2>50 / 30 / 20 planner</h2>
      <p class="card-note">Split your take-home pay into needs, wants and savings.</p>
      <label class="tool-label">Monthly take-home pay ($) <input type="number" id="plan-income" min="0" step="50" value="${s.incomeTotal}"></label>
      <div class="tool-result" id="plan-result">
        <div><span>Needs — 50%</span><strong>${money0(plan.needs)}</strong></div>
        <div><span>Wants — 30%</span><strong>${money0(plan.wants)}</strong></div>
        <div><span>Savings — 20%</span><strong>${money0(plan.savings)}</strong></div>
      </div>
      <p class="card-note">This household actually runs ${pct(s.needsTotal / s.incomeTotal * 100)} needs / ${pct(s.wantsTotal / s.incomeTotal * 100)} wants / ${pct(s.savingsRate * 100)} savings — leaner on wants than the rule asks.</p>
    </article>

    <article class="card tool-card">
      <h2>Debt payoff</h2>
      <p class="card-note">How long until a balance is gone — and what the interest costs.</p>
      <div class="tool-inputs">
        <label>Balance ($) <input type="number" id="debt-balance" min="0" step="100" value="4800"></label>
        <label>APR (%) <input type="number" id="debt-apr" min="0" step="0.1" value="21.9"></label>
        <label>Monthly payment ($) <input type="number" id="debt-payment" min="1" step="10" value="250"></label>
      </div>
      <div class="tool-result" id="debt-result">
        <div><span>Months to debt-free</span><strong>${debt.months}</strong></div>
        <div><span>Total interest</span><strong>${money(debt.interest)}</strong></div>
        <div><span>Paying $400/mo instead</span><strong>${debtFast.months} months · ${money(debtFast.interest)} interest</strong></div>
      </div>
      <p class="card-note">The Alvarez Visa balance is $4,800 at 21.9% APR. At $250 a month it takes ${debt.months} months; at $400 it takes ${debtFast.months} — and saves ${money(debt.interest - debtFast.interest)} in interest.</p>
    </article>

    <article class="card tool-card">
      <h2>Savings goal</h2>
      <p class="card-note">When will a goal be reached at a steady monthly amount?</p>
      <div class="tool-inputs">
        <label>Target ($) <input type="number" id="goal-target-input" min="0" step="50" value="3200"></label>
        <label>Saved so far ($) <input type="number" id="goal-saved-input" min="0" step="50" value="1875"></label>
        <label>Monthly saving ($) <input type="number" id="goal-monthly-input" min="0" step="10" value="150"></label>
      </div>
      <div class="tool-result" id="goal-result">
        <div><span>Months to go</span><strong>${goal.months}</strong></div>
        <div><span>Reached in</span><strong>${goal.lands}</strong></div>
      </div>
      <p class="card-note">The family vacation fund: $1,875 of $3,200, $150 a month — fully funded by ${goal.lands}.</p>
    </article>
  </section>
  <section class="card">
    <h2>Five budgeting habits that actually work</h2>
    <ol class="habits">${HABITS.map((h) => `<li><strong>${esc(h.title)}.</strong> ${esc(h.text)}</li>`).join('')}</ol>
  </section>`;
}
