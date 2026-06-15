// dashboard-app.jsx — Main App
const { useTweaks, TweaksPanel, TweakSection, TweakRadio } = window;
const {
  HeroSection, DomainGrid, DistributionChart,
  GrowthChart, PipelineSection, PartnersSection
} = window;
const { DatasetExplorer } = window;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "indigo",
  "explorerView": "table"
}/*EDITMODE-END*/;

function DashboardApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [filterCat, setFilterCat] = React.useState(null);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', t.theme);
  }, [t.theme]);

  const handleDomainClick = (catId) => {
    setFilterCat(catId);
    setTimeout(() => {
      const el = document.getElementById('explorer');
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <div className="app">
      <TweaksPanel>
        <TweakSection label="配色方案 Theme" />
        <TweakRadio label="Color" value={t.theme}
                    options={['amber', 'indigo', 'teal']}
                    labels={['Amber 暖琥珀', 'Indigo 科技蓝', 'Teal 医疗绿']}
                    onChange={v => setTweak('theme', v)} />
        <TweakSection label="数据集视图 View" />
        <TweakRadio label="Layout" value={t.explorerView}
                    options={['cards', 'table']}
                    labels={['Cards 卡片', 'Table 列表']}
                    onChange={v => setTweak('explorerView', v)} />
      </TweaksPanel>

      <HeroSection />

      <main className="main">
        <DomainGrid onSelect={handleDomainClick} />

        <section className="sec charts-row">
          <DistributionChart />
          <GrowthChart />
        </section>

        <PipelineSection />

        <DatasetExplorer viewMode={t.explorerView} filterCat={filterCat} />

        <PartnersSection />
      </main>

      <footer className="dash-footer">
        <div className="footer-in">
          <img src="Logo jpg-06.svg" alt="OneX Intelligence"
               style={{height: '22px', filter: 'brightness(0) invert(1)', opacity: .6}} />
          <span className="footer-txt">数据资产概览 · Data Asset Overview</span>
        </div>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<DashboardApp />);
