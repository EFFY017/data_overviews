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
      <div className="dom-size">
        {cat.totalSize === 0 ? '0.00' : cat.totalSize}
        <span className="dom-size-u">TB</span>
      </div>
      <div className="dom-bar-row">
        <div className="dom-bar">
          <div className="dom-bar-fill"
               style={{width: Math.max(cat.pctStorage, 2) + '%', background: cat.color}}>
          </div>
        </div>
      </div>
      <div className="dom-meta">
        <span>数据量 {cat.recordDisp || '—'}</span>
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

/* ── Distribution Chart ───────────────────────── */
function DistributionChart() {
  const sorted = [...DATA_CATEGORIES].sort((a, b) => b.recordSum - a.recordSum);
  const mx = sorted[0].recordSum || 1;
  const total = sorted.reduce((s, c) => s + c.recordSum, 0);
  return (
    <div className="chart-card">
      <h3 className="chart-h">数据量分布 <span className="chart-hen">Data Volume Distribution</span></h3>
      <div className="dist-rows">
        {sorted.map(c => {
          const pct = total > 0 ? c.recordSum / total * 100 : 0;
          return (
          <div key={c.id} className="dist-r">
            <span className="dist-dot" style={{background: c.color}}></span>
            <span className="dist-label">{c.name}</span>
            <div className="dist-track">
              <div className="dist-fill" style={{
                width: (c.recordSum / mx * 100) + '%', background: c.color
              }}></div>
            </div>
            <span className="dist-val">{c.recordDisp || '—'}</span>
            <span className="dist-pct">{pct > 0 ? pct.toFixed(1) + '%' : '—'}</span>
          </div>
          );
        })}
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
