// HomeLedger charts — hand-rolled SVG, no library, no network.
// Every chart is a pure function of numbers in, SVG string out.

const PALETTE = [
  '#14532d', '#c2700e', '#2e7d5b', '#8a5a00', '#4a7c59',
  '#b3541e', '#6b8e23', '#1f6f8b', '#7d5ba6', '#a83232',
  '#5b7a99', '#8c8c5a',
];

// Donut: spending by category. Centre label is the total spent.
export function donutChart(slices, total) {
  const size = 150, cx = 75, cy = 75, r = 60, inner = 39;
  let angle = -Math.PI / 2;
  let paths = '';
  slices.forEach((s, i) => {
    const frac = total > 0 ? s.value / total : 0;
    const a0 = angle, a1 = angle + frac * Math.PI * 2;
    angle = a1;
    if (frac <= 0) return;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1), yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0), yi0 = cy + inner * Math.sin(a0);
    paths += `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${PALETTE[i % PALETTE.length]}"><title>${s.label}: $${s.value.toLocaleString('en-US')}</title></path>`;
  });
  return `<svg class="donut-svg" width="150" height="150" viewBox="0 0 ${size} ${size}" role="img" aria-label="Spending by category donut chart">${paths}<text x="${cx}" y="${cy - 4}" text-anchor="middle" class="donut-total">$${total.toLocaleString('en-US')}</text><text x="${cx}" y="${cy + 16}" text-anchor="middle" class="donut-sub">spent in Nov</text></svg>`;
}

// historyBars: six monthly bars, November computed live. The tallest bar sets
// the scale; the November bar is highlighted in amber.
export function historyBars(months) {
  const w = 560, h = 128, pad = 8, base = h - 24;
  const max = Math.max(...months.map((m) => m.spent));
  const bw = 62, gap = (w - pad * 2 - bw * months.length) / (months.length - 1);
  let out = '';
  months.forEach((m, i) => {
    const bh = Math.max(4, Math.round(((base - 30) * m.spent) / max));
    const x = pad + i * (bw + gap);
    const y = base - bh;
    const fill = m.current ? '#c2700e' : '#14532d';
    out += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="4" fill="${fill}"><title>${m.label}: $${m.spent.toLocaleString('en-US')}</title></rect>`;
    out += `<text x="${x + bw / 2}" y="${y - 6}" text-anchor="middle" class="bar-value">$${m.spent.toLocaleString('en-US')}</text>`;
    out += `<text x="${x + bw / 2}" y="${base + 16}" text-anchor="middle" class="bar-label">${m.label}</text>`;
  });
  return `<svg class="bars-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Monthly spending, last six months">${out}</svg>`;
}

// progressBar: spent vs limit. Colour turns amber past 85%, red past 100%.
export function progressBar(spent, limit) {
  const pct = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
  const cls = pct >= 100 ? 'bar-over' : pct >= 85 ? 'bar-warn' : 'bar-ok';
  return `<div class="pbar" role="img" aria-label="${pct}% of budget used"><div class="pbar-fill ${cls}" style="width:${pct}%"></div></div>`;
}

export function money(n) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function money0(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

export function pct(n) {
  return (Math.round(n * 10) / 10).toString() + '%';
}
