// DatasetExplorer.tsx — Dataset Explorer with search and filter
import React from 'react';
import { DATA_CATEGORIES as CATS, ALL_DATASETS as DS } from '../data/datasets';

function DatasetExplorer({ viewMode, filterCat }) {
  const [search, setSearch] = React.useState('');
  const [selCat, setSelCat] = React.useState('all');
  const [expanded, setExpanded] = React.useState(null);
  const [limit, setLimit] = React.useState(24);

  React.useEffect(() => {
    if (filterCat) { setSelCat(filterCat); setLimit(24); }
  }, [filterCat]);

  const list = React.useMemo(() => {
    let r = DS;
    if (selCat !== 'all') r = r.filter(d => d.category === selCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
      );
    }
    return r;
  }, [search, selCat]);

  const shown = list.slice(0, limit);

  return (
    <section className="sec" id="explorer">
      <div className="sec-head">
        <h2 className="sec-title">数据集浏览 <span className="sec-en">Dataset Explorer</span></h2>
        <span className="sec-badge">{list.length} 个数据集</span>
      </div>

      <div className="exp-bar">
        <div className="exp-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="#999" strokeWidth="2" style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)'}}>
            <circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path>
          </svg>
          <input className="exp-input" placeholder="搜索数据集名称或描述…"
                 value={search}
                 onChange={e => { setSearch(e.target.value); setLimit(24); }} />
        </div>
        <div className="exp-pills">
          <button className={'pill' + (selCat === 'all' ? ' pill-on' : '')}
                  onClick={() => { setSelCat('all'); setLimit(24); }}>全部</button>
          {CATS.map(c => (
            <button key={c.id}
                    className={'pill' + (selCat === c.id ? ' pill-on' : '')}
                    style={selCat === c.id ? {background: c.color, borderColor: c.color} : {}}
                    onClick={() => { setSelCat(c.id); setLimit(24); }}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="ds-table-wrap">
          <table className="ds-table">
            <thead>
              <tr>
                <th>名称 Name</th><th>分类</th><th>大小</th><th>数据量</th><th>描述</th>
              </tr>
            </thead>
            <tbody>
              {shown.map(d => (
                <tr key={d.id} className={d.exclusive ? 'tr-ex' : ''}>
                  <td className="td-nm">
                    {d.name}
                    {d.exclusive && <span className="ex-badge">独家</span>}
                  </td>
                  <td>
                    <span className="cat-pill"
                          style={{background: d.categoryColor + '15', color: d.categoryColor}}>
                      {d.categoryName}
                    </span>
                  </td>
                  <td className="td-mono">{d.size}</td>
                  <td className="td-mono">{d.records ? d.records + (d.recordUnit ? ' ' + d.recordUnit : '') : '未统计'}</td>
                  <td className="td-desc">{d.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="ds-grid">
          {shown.map(d => (
            <div key={d.id}
                 className={'ds-card' + (expanded === d.id ? ' ds-card-open' : '')}
                 onClick={() => setExpanded(expanded === d.id ? null : d.id)}>
              <div className="ds-top">
                <span className="cat-pill"
                      style={{background: d.categoryColor + '15', color: d.categoryColor}}>
                  {d.categoryName}
                </span>
                {d.exclusive && <span className="ex-star" title="独家数据">★</span>}
              </div>
              <h4 className="ds-name">{d.name}</h4>
              <div className="ds-meta">
                <span className="ds-size">{d.size}</span>
                <span>{d.records ? d.records + (d.recordUnit ? ' ' + d.recordUnit : ' 条') : '未统计'}</span>
              </div>
              {expanded === d.id && (
                <div className="ds-detail">
                  {d.description && <p className="ds-desc">{d.description}</p>}
                  <dl className="ds-fields">
                    <div><dt>大小</dt><dd>{d.size}</dd></div>
                    <div><dt>数据量</dt><dd>{d.records ? d.records + (d.recordUnit ? ' ' + d.recordUnit : '') : '未统计'}</dd></div>
                    {d.sample && <div><dt>样本</dt><dd>{d.sample}</dd></div>}
                  </dl>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {list.length > limit && (
        <div className="load-more">
          <button className="load-btn"
                  onClick={() => setLimit(l => l + 24)}>
            加载更多 ({list.length - limit} 剩余)
          </button>
        </div>
      )}
    </section>
  );
}

export { DatasetExplorer };
