// sections.tsx — Dashboard visual sections
import React from 'react';
import {
  DATA_CATEGORIES, HERO_STATS, GROWTH_DATA, PARTNERS, PIPELINE_STAGES,
} from '../data/datasets';
import logo from '../assets/logo.svg';

function useCountUp(target) {
  return target;
}

/* ── Hero ─────────────────────────────────────── */
function HeroSection() {
  return (
    <header className="hero">
      <div className="hero-inner">
        <div className="hero-brand">
          <img src={logo} className="hero-logo-img" alt="OneX Intelligence" />
          <div className="hero-divider"></div>
          <p className="hero-sub">数据资产概览<span className="hero-sub-en">Data Asset Overview</span></p>
        </div>
        <p className="hero-tagline">构建医疗AI最全面的数据底座，覆盖诊断、科研、新药研发全流程</p>
        <div className="hero-stats">
          {HERO_STATS.map((s, i) => <HeroStat key={i} stat={s} delay={i * 150} />)}
        </div>
      </div>
    </header>
  );
}

function HeroStat({ stat, delay }) {
  const isNum = typeof stat.value === 'number';
  const v = useCountUp(isNum ? stat.value : 0);
  const display = isNum ? v.toLocaleString() : stat.value;
  return (
    <div className="hero-stat">
      <div className="hero-stat-num">
        {display}<span className="hero-stat-unit">{stat.unit}</span>
      </div>
      <div className="hero-stat-label">{stat.label}</div>
      <div className="hero-stat-labelen">{stat.labelEn}</div>
    </div>
  );
}

/* ── Domain Grid ──────────────────────────────── */
function DomainGrid({ onSelect }) {
  return (
    <section className="sec">
      <div className="sec-head">
        <h2 className="sec-title">数据领域 <span className="sec-en">Data Domains</span></h2>
        <span className="sec-badge">{DATA_CATEGORIES.length} 个领域 · 共 {DATA_CATEGORIES.reduce((s, c) => s + c.datasetCount, 0)} 个数据集 · 点击卡片跳转至数据集</span>
      </div>
      <div className="dom-grid">
        {DATA_CATEGORIES.map((c, i) => (
          <DomainCard key={c.id} cat={c} index={i} onClick={() => onSelect && onSelect(c.id)} />
        ))}
      </div>
    </section>
  );
}

function DomainCard({ cat, index, onClick }) {
  const tags = cat.featured.slice(0, 3);
  const rest = cat.datasetCount - tags.length;
  return (
    <div className="dom-card" onClick={onClick}
         style={{'--cc': cat.color} as React.CSSProperties}>
      <div className="dom-head">
        <span className="dom-dot" style={{background: cat.color}}></span>
        <div>
          <span className="dom-name">{cat.name}</span>
          <span className="dom-en">{cat.nameEn}</span>
        </div>
      </div>
      <div className="dom-figs">
        <div className="dom-size">
          {cat.totalSize === 0 ? '0.00' : cat.totalSize}
          <span className="dom-size-u">TB</span>
        </div>
        <div className="dom-records">
          <span className="dom-records-label">数据量</span>
          {cat.hasRecord
            ? <>{cat.recordDisp}<span className="dom-records-u">条</span></>
            : <span className="dom-records-na">未统计</span>}
        </div>
      </div>
      <div className="dom-tags">
        {tags.map((t, i) => (
          <span key={i} className={'dom-tag' + (t.exclusive ? ' dom-tag-ex' : '')}>
            {t.name.length > 14 ? t.name.slice(0, 14) + '…' : t.name}
          </span>
        ))}
        {rest > 0 && <span className="dom-tag dom-tag-more">+{rest}</span>}
      </div>
      <div className="dom-desc">{cat.description}</div>
    </div>
  );
}

/* ── Distribution Chart (饼图) ─────────────────── */
function donutArc(cx, cy, r, ir, a0, a1) {
  const p = (radius, ang) => [cx + radius * Math.cos(ang), cy + radius * Math.sin(ang)];
  const [x0, y0] = p(r, a0), [x1, y1] = p(r, a1);
  const [xi1, yi1] = p(ir, a1), [xi0, yi0] = p(ir, a0);
  const large = (a1 - a0) > Math.PI ? 1 : 0;
  return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} L ${xi1} ${yi1} A ${ir} ${ir} 0 ${large} 0 ${xi0} ${yi0} Z`;
}

const PIE_NA = '#D9DBE3'; // 未统计领域的中性灰

// 把领域品牌色降饱和、统一明度，得到一组柔和但仍可区分的多彩配色
function mutedColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0;
  if (max !== min) {
    const d = max - min;
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h /= 6;
  }
  const S = 0.40, L = 0.66; // 统一低饱和、中高明度
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = L < 0.5 ? L * (1 + S) : L + S - L * S;
  const p = 2 * L - q;
  const toHex = (v) => Math.round(v * 255).toString(16).padStart(2, '0');
  return '#' + toHex(hue2rgb(p, q, h + 1 / 3)) + toHex(hue2rgb(p, q, h)) + toHex(hue2rgb(p, q, h - 1 / 3));
}

function fmtSize(bytes) {
  const TB = 1024 ** 4, GB = 1024 ** 3, MB = 1024 ** 2, KB = 1024;
  if (bytes >= TB) return +(bytes / TB).toFixed(bytes / TB >= 100 ? 0 : 1) + ' TB';
  if (bytes >= GB) return +(bytes / GB).toFixed(1) + ' GB';
  if (bytes >= MB) return +(bytes / MB).toFixed(1) + ' MB';
  if (bytes >= KB) return +(bytes / KB).toFixed(1) + ' KB';
  return bytes + ' B';
}

function DistributionChart() {
  const [active, setActive] = React.useState(null);
  const sorted = [...DATA_CATEGORIES].sort((a, b) => b.totalBytes - a.totalBytes);
  const total = sorted.reduce((s, c) => s + c.totalBytes, 0);

  // 计算每个扇区的起止角（从正上方 -90° 顺时针）
  const cx = 110, cy = 110, r = 104, ir = 62;
  let acc = -Math.PI / 2;
  const slices = sorted.map(c => {
    const frac = total > 0 ? c.totalBytes / total : 0;
    const a0 = acc;
    const a1 = acc + frac * Math.PI * 2;
    acc = a1;
    const hasSize = c.sizedCount > 0;
    return {
      c, frac, a0, a1, pct: frac * 100, hasSize,
      color: hasSize ? mutedColor(c.color) : PIE_NA,
    };
  });

  const act = active != null ? slices.find(s => s.c.id === active) : null;

  return (
    <div className="chart-card">
      <h3 className="chart-h">存储分布 <span className="chart-hen">Storage Distribution</span></h3>
      <div className="pie-caption">
        {act ? (
          <>
            <span className="pie-caption-dot" style={{background: act.color}}></span>
            <span className="pie-caption-name">{act.c.name}</span>
            <span className="pie-caption-meta">
              {act.hasSize
                ? `${fmtSize(act.c.totalBytes)} · ${act.pct >= 0.05 ? act.pct.toFixed(1) + '%' : '<0.1%'}`
                : '未统计'}
            </span>
          </>
        ) : (
          <span className="pie-caption-empty">悬停色块或图例查看各领域占比</span>
        )}
      </div>
      <div className="pie-wrap">
        <svg className="pie-svg" viewBox="0 0 220 220" role="img" aria-label="存储分布饼图">
          {slices.filter(s => s.frac > 0).map(s => (
            <path key={s.c.id} d={donutArc(cx, cy, r, ir, s.a0, s.a1)}
                  fill={s.color} stroke="#fff" strokeWidth={1.5}
                  style={{ opacity: act && act.c.id !== s.c.id ? 0.28 : 1, cursor: 'pointer' }}
                  onMouseEnter={() => setActive(s.c.id)}
                  onMouseLeave={() => setActive(null)} />
          ))}
          <text x={cx} y={cy - 4} className="pie-center-num" textAnchor="middle">
            {act ? (act.hasSize ? fmtSize(act.c.totalBytes) : '未统计') : fmtSize(total)}
          </text>
          <text x={cx} y={cy + 15} className="pie-center-lbl" textAnchor="middle">
            {act ? (act.hasSize ? (act.pct >= 0.05 ? act.pct.toFixed(1) + '%' : '<0.1%') : '') : '存储合计'}
          </text>
        </svg>
        <div className="pie-legend">
          {slices.map(s => (
            <div key={s.c.id}
                 className={'pie-leg' + (active === s.c.id ? ' pie-leg-on' : '')}
                 onMouseEnter={() => setActive(s.c.id)}
                 onMouseLeave={() => setActive(null)}
                 title={s.hasSize
                   ? `${s.c.name}：${fmtSize(s.c.totalBytes)}（${s.pct.toFixed(1)}%）`
                   : `${s.c.name}：未统计`}>
              <span className="pie-leg-dot" style={{background: s.color}}></span>
              <span className="pie-leg-name">{s.c.name}</span>
              <span className="pie-leg-pct">
                {!s.hasSize ? '未统计' : (s.pct >= 0.05 ? s.pct.toFixed(1) + '%' : '<0.1%')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Growth Chart ─────────────────────────────── */
function GrowthChart() {
  const d = GROWTH_DATA;
  const mxD = Math.max(...d.map(x => x.datasets));
  const mxS = Math.max(...d.map(x => x.sizeTB));
  return (
    <div className="chart-card">
      <h3 className="chart-h">增长趋势 <span className="chart-hen">Growth Trend</span></h3>
      <div className="grow-bars">
        {d.map((g, i) => (
          <div key={i} className="grow-col">
            <div className="grow-vals">
              <span className="grow-val-ds">{g.datasets}</span>
              <span className="grow-val-sz">{g.sizeTB} TB</span>
            </div>
            <div className="grow-pair">
              <div className="grow-b grow-b-ds"
                   style={{height: (g.datasets / mxD * 100) + '%'}}
                   title={g.datasets + ' 数据集'}></div>
              <div className="grow-b grow-b-sz"
                   style={{height: (g.sizeTB / mxS * 100) + '%'}}
                   title={g.sizeTB + ' TB'}></div>
            </div>
            <span className="grow-lbl">{g.period}</span>
          </div>
        ))}
      </div>
      <div className="grow-legend">
        <span className="grow-leg"><span className="grow-dot grow-dot-ds"></span>数据集数</span>
        <span className="grow-leg"><span className="grow-dot grow-dot-sz"></span>存储量(TB)</span>
      </div>
    </div>
  );
}

/* ── Pipeline ─────────────────────────────────── */
function PipelineSection() {
  return (
    <section className="sec">
      <div className="sec-head">
        <h2 className="sec-title">全流程覆盖 <span className="sec-en">Full Pipeline</span></h2>
      </div>
      <div className="pipe-flow">
        {PIPELINE_STAGES.map((s, i) => (
          <React.Fragment key={i}>
            {i > 0 && <div className="pipe-arrow">→</div>}
            <div className="pipe-card">
              <div className="pipe-title-row">
                <span className="pipe-num">0{i + 1}</span>
                <h3 className="pipe-name">{s.name}</h3>
              </div>
              <span className="pipe-en">{s.nameEn}</span>
              <div className="pipe-count">{s.datasets} <span>相关数据集</span></div>
              <p className="pipe-desc">{s.description}</p>
            </div>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

/* ── Partners ─────────────────────────────────── */
function PartnersSection() {
  const xinhua = PARTNERS.find(p => p.name === '新华医院');
  const others = PARTNERS.filter(p => p.name !== '新华医院');
  const groups: Record<string, typeof PARTNERS> = {};
  others.forEach(p => { (groups[p.type] = groups[p.type] || []).push(p); });
  return (
    <section className="sec">
      <div className="sec-head">
        <h2 className="sec-title">数据生态 <span className="sec-en">Data Ecosystem</span></h2>
        <span className="sec-badge">{PARTNERS.length}+ 合作伙伴</span>
      </div>
      {xinhua && (
        <div className="part-featured">
          <div className="part-featured-inner">
            <div className="part-featured-icon">★</div>
            <div className="part-featured-info">
              <span className="part-featured-label">核心合作伙伴</span>
              <span className="part-featured-name">{xinhua.name}</span>
              <span className="part-featured-en">{xinhua.nameEn}</span>
            </div>
            <div className="part-featured-desc">深度数据合作，共建医疗AI数据底座</div>
          </div>
        </div>
      )}
      <div className="part-grid">
        {Object.entries(groups).map(([type, list]) => (
          <div key={type} className="part-group">
            <h4 className="part-type">{type}</h4>
            {list.map((p, i) => (
              <div key={i} className="part-chip">
                <span className="part-name">{p.name}</span>
                <span className="part-en">{p.nameEn}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export {
  HeroSection, DomainGrid, DistributionChart,
  GrowthChart, PipelineSection, PartnersSection,
};
