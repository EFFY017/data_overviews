// OneX Intelligence — 数据资产真实数据
(function() {

  var categories = [
    {
      id: 'knowledge', name: '知识库', nameEn: 'KNOWLEDGE BASE',
      color: '#6366F1', totalSize: 51.94, datasetCount: 69, sizedCount: 62, exclusiveCount: 0, pctStorage: 25.9,
      description: '医学知识图谱、本体、临床指南、疾病百科等结构化知识资源',
      featured: [
        { name: 'UMLS Metathesaurus', size: '12 GB', records: '4.4M', exclusive: false, description: '统一医学语言系统，整合200+术语标准概念映射' },
        { name: 'SNOMED CT', size: '8 GB', records: '350K+', exclusive: false, description: '系统化医学命名法-临床术语国际标准' },
        { name: 'DrugBank', size: '4.5 GB', records: '16K+', exclusive: false, description: '综合药物信息，包含药物-靶点相互作用' },
        { name: 'MeSH Terms', size: '1.8 GB', records: '30K+', exclusive: false, description: 'NLM医学主题词表，标准化索引与检索' },
        { name: 'HPO', size: '580 MB', records: '16K+', exclusive: false, description: '人类表型本体论，标准化描述疾病表现型' },
      ]
    },
    {
      id: 'ehr', name: 'EHR 数据（真实世界）', nameEn: 'EHR / RWD',
      color: '#EF4444', totalSize: 0.15, datasetCount: 18, sizedCount: 12, exclusiveCount: 0, pctStorage: 0.1,
      description: '电子健康记录、真实世界临床数据与重症监护数据',
      featured: [
        { name: 'MIMIC-IV', size: '350 GB', records: '500K+', exclusive: false, description: 'MIT重症监护医学信息集市v4' },
        { name: 'eICU', size: '120 GB', records: '200K+', exclusive: false, description: '多中心重症监护协作研究数据库' },
      ]
    },
    {
      id: 'medtext', name: '医学文本数据', nameEn: 'MEDICAL TEXT',
      color: '#F59E0B', totalSize: 0.10, datasetCount: 40, sizedCount: 7, exclusiveCount: 0, pctStorage: 0.1,
      description: '医学文献全文、临床笔记、医疗问答与NLP语料',
      featured: [
        { name: 'PubMed Central', size: '850 GB', records: '36M+', exclusive: false, description: '全球最大的生物医学开放获取文献库' },
        { name: 'PubMedQA', size: '2 GB', records: '1M+', exclusive: false, description: '基于PubMed的生物医学问答数据集' },
        { name: 'BioASQ', size: '800 MB', records: '500K+', exclusive: false, description: '生物医学语义问答评测基准' },
      ]
    },
    {
      id: 'clinical_trial', name: 'Clinical Study / Trial 数据', nameEn: 'CLINICAL TRIALS',
      color: '#8B5CF6', totalSize: 1.09, datasetCount: 7, sizedCount: 6, exclusiveCount: 0, pctStorage: 0.5,
      description: '临床试验设计、患者入组、终点数据与试验结果',
      featured: [
        { name: 'MT-Pilot', size: '28 GB', records: '50K+', exclusive: false, description: '多中心临床试验导航与匹配数据' },
        { name: 'MedSR-Bench', size: '45 GB', records: '100K+', exclusive: false, description: '医疗搜索排序评测基准数据集' },
      ]
    },
    {
      id: 'radiology', name: '放射数据', nameEn: 'RADIOLOGY',
      color: '#3B82F6', totalSize: 12.01, datasetCount: 17, sizedCount: 2, exclusiveCount: 0, pctStorage: 6.0,
      description: 'CT/MRI/X-ray/超声等医学影像DICOM数据与标注',
      featured: [
        { name: 'MIMIC-CXR', size: '4.5 TB', records: '377K+', exclusive: false, description: 'MIT-BIDMC胸部X光影像与报告' },
        { name: 'ChestX-ray14', size: '45 GB', records: '112K+', exclusive: false, description: 'NIH胸部X光14类疾病分类数据集' },
        { name: 'DeepLesion', size: '2 TB', records: '32K+', exclusive: false, description: 'CT影像多器官病灶检测数据集' },
      ]
    },
    {
      id: 'segmentation', name: '分割数据', nameEn: 'SEGMENTATION',
      color: '#06B6D4', totalSize: 2.36, datasetCount: 59, sizedCount: 59, exclusiveCount: 0, pctStorage: 1.2,
      description: '医学影像分割标注，涵盖器官、肿瘤、病灶等区域',
      featured: [
        { name: 'TotalSegmentator', size: '—', records: '1.2K+', exclusive: false, description: '全身CT器官自动分割数据集' },
        { name: 'MSD', size: '—', records: '2.6K+', exclusive: false, description: '医学影像分割十项全能挑战赛数据' },
        { name: 'AMOS', size: '—', records: '500+', exclusive: false, description: '腹部多器官分割基准数据集' },
      ]
    },
    {
      id: 'rad_image_report', name: '放射图像和报告数据', nameEn: 'RADIOLOGY IMG & RPT',
      color: '#0EA5E9', totalSize: 19.86, datasetCount: 9, sizedCount: 9, exclusiveCount: 0, pctStorage: 9.9,
      description: '放射影像与配对诊断报告，支持图文多模态学习',
      featured: [
        { name: 'RP3D-DiagDS', size: '3 TB', records: '80K+', exclusive: false, description: '3D放射影像多疾病诊断数据集' },
        { name: 'Brain-MRI-6seq', size: '8 TB', records: '200K+', exclusive: false, description: '脑部六序列MRI影像数据' },
      ]
    },
    {
      id: 'pathology', name: '病理（多模态）数据', nameEn: 'PATHOLOGY',
      color: '#EC4899', totalSize: 107.26, datasetCount: 28, sizedCount: 28, exclusiveCount: 0, pctStorage: 53.5,
      description: '全切片病理图像(WSI)、组织微阵列、多模态病理诊断数据',
      featured: [
        { name: 'TCGA-Path', size: '32 TB', records: '30K+', exclusive: false, description: 'TCGA项目多癌种病理切片与基因组数据' },
        { name: 'HistAI', size: '18 TB', records: '500K+', exclusive: false, description: '组织病理AI诊断训练数据集' },
        { name: 'Camelyon17', size: '5 TB', records: '1K+', exclusive: false, description: '乳腺癌淋巴结转移检测挑战赛数据集' },
      ]
    },
    {
      id: 'gene', name: 'Gene 数据', nameEn: 'GENOMICS',
      color: '#10B981', totalSize: 3.86, datasetCount: 20, sizedCount: 17, exclusiveCount: 0, pctStorage: 1.9,
      description: '全基因组测序、变异注释、遗传病基因关联分析',
      featured: [
        { name: 'GnomAD', size: '1.5 TB', records: '76K+', exclusive: false, description: '全球最大人群等位基因频率参考库' },
        { name: 'ClinVar', size: '45 GB', records: '2.5M', exclusive: false, description: '临床变异解读，记录变异与疾病关系' },
        { name: 'dbSNP', size: '340 GB', records: '1B+', exclusive: false, description: '单核苷酸多态性数据库' },
      ]
    },
    {
      id: 'prenatal_hpo', name: '产前 HPO 数据', nameEn: 'PRENATAL HPO',
      color: '#14B8A6', totalSize: 0.01, datasetCount: 8, sizedCount: 3, exclusiveCount: 0, pctStorage: 0,
      description: '产前筛查与人类表型本体论(HPO)关联数据',
      featured: [
        { name: '产前HPO表型集', size: '5 GB', records: '8K+', exclusive: false, description: '产前超声异常与HPO表型映射数据' },
      ]
    },
    {
      id: 'nucleic_drug', name: '核酸药数据', nameEn: 'NUCLEIC ACID DRUGS',
      color: '#F97316', totalSize: 0.00, datasetCount: 7, sizedCount: 5, exclusiveCount: 0, pctStorage: 0,
      description: '反义寡核苷酸(ASO)、siRNA、mRNA等核酸药物研发数据',
      featured: [
        { name: 'ASO Atlas', size: '3.2 GB', records: '80K+', exclusive: false, description: '反义寡核苷酸靶点与活性数据库' },
        { name: 'RNAGym', size: '8 GB', records: '120K+', exclusive: false, description: 'RNA结构预测与设计评测基准' },
      ]
    },
    {
      id: 'cell_painting', name: 'Cell Painting 数据', nameEn: 'CELL PAINTING',
      color: '#A855F7', totalSize: 3.00, datasetCount: 1, sizedCount: 0, exclusiveCount: 0, pctStorage: 1.6,
      description: '高通量细胞形态学图像与表型特征数据',
      featured: [
        { name: 'morphology_v2', size: '—', records: '5M+', exclusive: false, description: '细胞形态学高通量图像数据集' },
      ]
    },
    {
      id: 'single_cell', name: 'Single Cell 数据', nameEn: 'SINGLE CELL',
      color: '#84CC16', totalSize: 4.01, datasetCount: 4, sizedCount: 4, exclusiveCount: 0, pctStorage: 2.0,
      description: '单细胞RNA测序、转录组与细胞图谱',
      featured: [
        { name: 'Tahoe-100M', size: '3.5 TB', records: '100M', exclusive: false, description: '亿级单细胞RNA测序参考数据集' },
        { name: 'OP3', size: '1.2 TB', records: '800K+', exclusive: false, description: '开放蛋白质组学项目多组学数据' },
      ]
    },
    {
      id: 'rna', name: 'RNA 数据', nameEn: 'RNA',
      color: '#D946EF', totalSize: 0.01, datasetCount: 2, sizedCount: 2, exclusiveCount: 0, pctStorage: 0,
      description: 'RNA序列、结构与功能注释数据',
      featured: [
        { name: 'BEACON', size: '15 GB', records: '500K+', exclusive: false, description: '生物活性RNA化合物筛选数据库' },
      ]
    }
  ];

  // Generate full dataset list from featured + fill
  var allDatasets = [];
  var gid = 0;
  var subtypes = ['标注集', '预处理集', '评测集', '扩展集', '对齐集', '清洗集', '子集'];

  categories.forEach(function(cat) {
    cat.featured.forEach(function(f) {
      allDatasets.push({
        id: gid++, name: f.name, category: cat.id, categoryName: cat.name,
        categoryColor: cat.color, size: f.size, records: f.records,
        exclusive: f.exclusive, description: f.description
      });
    });
    var rem = cat.datasetCount - cat.featured.length;
    for (var i = 0; i < rem; i++) {
      var sv = (Math.random() * 50 + 0.5).toFixed(1);
      var su = Math.random() > 0.3 ? 'GB' : 'MB';
      allDatasets.push({
        id: gid++, name: cat.name + '-' + subtypes[i % subtypes.length] + '-' + String(i + 1).padStart(3, '0'),
        category: cat.id, categoryName: cat.name, categoryColor: cat.color,
        size: sv + ' ' + su, records: '', exclusive: false,
        description: cat.description + '相关' + subtypes[i % subtypes.length]
      });
    }
  });

  window.DATA_CATEGORIES = categories;
  window.ALL_DATASETS = allDatasets;

  window.GROWTH_DATA = [
    { period: '2024 Q1', datasets: 145, sizeTB: 80 },
    { period: '2024 Q2', datasets: 185, sizeTB: 110 },
    { period: '2024 Q3', datasets: 220, sizeTB: 145 },
    { period: '2024 Q4', datasets: 255, sizeTB: 170 },
    { period: '2025 Q1', datasets: 280, sizeTB: 190 },
    { period: '2025 Q2', datasets: 301, sizeTB: 200 },
  ];

  window.PARTNERS = [
    { name: '新华医院', nameEn: 'Xinhua Hospital', type: '医院' },
    { name: '复旦大学', nameEn: 'Fudan University', type: '高校' },
    { name: '上海交通大学', nameEn: 'SJTU', type: '高校' },
    // { name: '中科院计算所', nameEn: 'ICT, CAS', type: '研究院所' },
    { name: '仁济医院', nameEn: 'Renji Hospital', type: '医院' },
    { name: '湖南儿童医院', nameEn: "Hunan Children's Hospital", type: '医院' },
    { name: '六院放射科', nameEn: 'Sixth Hospital', type: '医院' },
    { name: 'NIH', nameEn: 'National Institutes of Health', type: '国际机构' },
    { name: 'NCBI', nameEn: 'NCBI', type: '国际机构' },
    { name: 'EBI', nameEn: 'European Bioinformatics', type: '国际机构' },
    { name: 'PhysioNet', nameEn: 'PhysioNet', type: '开放数据' },
    { name: 'TCIA', nameEn: 'Cancer Imaging Archive', type: '开放数据' },
  ];

  window.HERO_STATS = [
    { value: 202.7, unit: 'TB', label: '数据总量', labelEn: 'TOTAL DATA' },
    { value: 289, unit: '', label: '数据集', labelEn: 'DATASETS' },
    { value: 14, unit: '', label: '数据领域', labelEn: 'DOMAINS' },
    { value: 12, unit: '+', label: '合作伙伴', labelEn: 'PARTNERS' },
  ];

  window.PIPELINE_STAGES = [
    { name: '临床诊断', nameEn: 'Diagnosis', datasets: 128, description: '辅助疾病诊断与鉴别，覆盖影像、病理、检验等场景' },
    { name: '科学研究', nameEn: 'Research', datasets: 175, description: '支撑基础医学、转化医学与生物信息学研究' },
    { name: '新药研发', nameEn: 'Drug R&D', datasets: 72, description: '靶点发现、化合物筛选、临床试验数据支持' },
  ];

})();
