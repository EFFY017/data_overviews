// OneX Intelligence — 数据资产指标聚合
// 所有指标均由 MOCK_DATA（后端真实数据）实时聚合计算。
import { MOCK_DATA } from './mockData';
import type {
  MockRow, DataCategory, Dataset, HeroStat, GrowthPoint, Partner, PipelineStage,
} from './types';

const MOCK = MOCK_DATA;
const TB = Math.pow(1024, 4);

// 领域元数据：按后端 category 原始字符串映射到展示用 id / 名称 / 配色 / 描述
const META: Record<string, { id: string; name: string; nameEn: string; color: string; description: string }> = {
  '知识库': { id: 'knowledge', name: '知识库', nameEn: 'KNOWLEDGE BASE', color: '#6366F1',
    description: '医学知识图谱、本体、临床指南、疾病百科等结构化知识资源' },
  'EHR数据（Real-wod部分）（请区分Trial产生的ideal environment 下的EHR请放到后续的Clinical study& study里去）':
    { id: 'ehr', name: 'EHR 数据（真实世界）', nameEn: 'EHR / RWD', color: '#EF4444',
      description: '电子健康记录、真实世界临床数据与重症监护数据' },
  '医学文本数据': { id: 'medtext', name: '医学文本数据', nameEn: 'MEDICAL TEXT', color: '#F59E0B',
    description: '医学文献全文、临床笔记、医疗问答与NLP语料' },
  'Clinical Study/Tial Data': { id: 'clinical_trial', name: 'Clinical Study / Trial 数据', nameEn: 'CLINICAL TRIALS', color: '#8B5CF6',
    description: '临床试验设计、患者入组、终点数据与试验结果' },
  '放射数据': { id: 'radiology', name: '放射数据', nameEn: 'RADIOLOGY', color: '#3B82F6',
    description: 'CT/MRI/X-ray/超声等医学影像DICOM数据与标注' },
  '分割数据': { id: 'segmentation', name: '分割数据', nameEn: 'SEGMENTATION', color: '#06B6D4',
    description: '医学影像分割标注，涵盖器官、肿瘤、病灶等区域' },
  '放射图像和报告数据': { id: 'rad_image_report', name: '放射图像和报告数据', nameEn: 'RADIOLOGY IMG & RPT', color: '#0EA5E9',
    description: '放射影像与配对诊断报告，支持图文多模态学习' },
  '病理（多模态）数据': { id: 'pathology', name: '病理（多模态）数据', nameEn: 'PATHOLOGY', color: '#EC4899',
    description: '全切片病理图像(WSI)、组织微阵列、多模态病理诊断数据' },
  'Gene数据': { id: 'gene', name: 'Gene 数据', nameEn: 'GENOMICS', color: '#10B981',
    description: '全基因组测序、变异注释、遗传病基因关联分析' },
  '产前hpo数据': { id: 'prenatal_hpo', name: '产前 HPO 数据', nameEn: 'PRENATAL HPO', color: '#14B8A6',
    description: '产前筛查与人类表型本体论(HPO)关联数据' },
  '核酸药数据': { id: 'nucleic_drug', name: '核酸药数据', nameEn: 'NUCLEIC ACID DRUGS', color: '#F97316',
    description: '反义寡核苷酸(ASO)、siRNA、mRNA等核酸药物研发数据' },
  'Cell Painting数据': { id: 'cell_painting', name: 'Cell Painting 数据', nameEn: 'CELL PAINTING', color: '#A855F7',
    description: '高通量细胞形态学图像与表型特征数据' },
  'Single Cell数据': { id: 'single_cell', name: 'Single Cell 数据', nameEn: 'SINGLE CELL', color: '#84CC16',
    description: '单细胞RNA测序、转录组与细胞图谱' },
  'RNA数据': { id: 'rna', name: 'RNA 数据', nameEn: 'RNA', color: '#D946EF',
    description: 'RNA序列、结构与功能注释数据' },
  '3D Vision 数据': { id: 'vision_3d', name: '3D Vision 数据', nameEn: '3D VISION', color: '#2563EB',
    description: '三维视觉数据，点云、深度估计与立体重建' },
  'General Vision 数据': { id: 'vision_general', name: 'General Vision 数据', nameEn: 'GENERAL VISION', color: '#DB2777',
    description: '通用视觉图像数据，自然图像与多任务视觉语料' },
  'Sports 数据': { id: 'sports', name: 'Sports 数据', nameEn: 'SPORTS', color: '#65A30D',
    description: '运动视频与体育动作分析数据' },
  'Audio-visual 数据': { id: 'audio_visual', name: 'Audio-visual 数据', nameEn: 'AUDIO-VISUAL', color: '#EA580C',
    description: '音视频多模态数据，语音、声音事件与视听对齐' },
  'Video Temporal Grounding 数据': { id: 'video_grounding', name: 'Video Temporal Grounding 数据', nameEn: 'VIDEO GROUNDING', color: '#7C3AED',
    description: '视频时序定位数据，文本-视频片段对齐标注' },
};

function slug(s: string): string {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'cat';
}

// 数据量（recordCount）紧凑格式：23.1B / 4.4M / 27K
function fmtCount(n: number | null): string {
  if (n == null) return '';
  if (n >= 1e9) return +(n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return +(n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return +(n / 1e3).toFixed(1) + 'K';
  return '' + n;
}

// 按 category 分组（保持后端出现顺序）
const order: string[] = [];
const groups: Record<string, MockRow[]> = {};
MOCK.forEach((d) => {
  const key = d.category || '未分类';
  if (!groups[key]) { groups[key] = []; order.push(key); }
  groups[key].push(d);
});

let grandBytes = 0;
MOCK.forEach((d) => { if (typeof d.sizeBytes === 'number') grandBytes += d.sizeBytes; });

type CategoryWithRows = DataCategory & { _rows?: MockRow[] };

const categories: CategoryWithRows[] = order.map((key): CategoryWithRows => {
  const meta = META[key] || { id: slug(key), name: key, nameEn: '', color: '#94A3B8', description: '' };
  const rows = groups[key];
  let bytes = 0, sized = 0, recordSum = 0;
  rows.forEach((d) => {
    if (typeof d.sizeBytes === 'number') { bytes += d.sizeBytes; sized++; }
    if (typeof d.recordCount === 'number') recordSum += d.recordCount;
  });
  // featured：按存储大小降序的真实数据集名（用于卡片标签）
  const featured = rows.slice().sort((a, b) => {
    return (b.sizeBytes || 0) - (a.sizeBytes || 0);
  }).map((d) => ({ name: d.name, exclusive: false }));

  return {
    id: meta.id, name: meta.name, nameEn: meta.nameEn, color: meta.color,
    description: meta.description,
    totalBytes: bytes,
    totalSize: +(bytes / TB).toFixed(2),       // 存储容量 (TB)
    datasetCount: rows.length,                  // 数据集个数
    sizedCount: sized,
    recordSum: recordSum,                       // 数据量（recordCount 之和）
    recordDisp: fmtCount(recordSum),
    exclusiveCount: 0,
    pctStorage: grandBytes > 0 ? +((bytes / grandBytes) * 100).toFixed(1) : 0,
    featured: featured,
    _rows: rows,
  };
});

// 完整数据集列表（供浏览器使用），直接来自真实数据
const allDatasets: Dataset[] = [];
let gid = 0;
categories.forEach((cat) => {
  (cat._rows || []).forEach((d) => {
    allDatasets.push({
      id: gid++,
      name: d.name,
      category: cat.id,
      categoryName: cat.name,
      categoryColor: cat.color,
      size: (d.sizeDisp || (d.sizeRaw && d.sizeRaw.trim()) || '—'),
      sizeOk: d.sizeOk !== false,
      records: (typeof d.recordCount === 'number' ? fmtCount(d.recordCount) : ''),
      recordUnit: d.recordUnit || '',
      sample: d.sample || '',
      exclusive: false,
      description: d.description || '',
    });
  });
  delete cat._rows;
});

const totalTB = Math.round(grandBytes / TB);
let grandRecords = 0;
MOCK.forEach((d) => { if (typeof d.recordCount === 'number') grandRecords += d.recordCount; });

// 长单位格式：用于顶部数据总量，如 36 → Billion
function fmtLong(n: number): { value: number; unit: string } {
  if (n >= 1e9) return { value: +(n / 1e9).toFixed(n >= 1e10 ? 0 : 1), unit: 'Billion' };
  if (n >= 1e6) return { value: +(n / 1e6).toFixed(1), unit: 'Million' };
  if (n >= 1e3) return { value: +(n / 1e3).toFixed(1), unit: 'Thousand' };
  return { value: n, unit: '' };
}
const totalRecordsLong = fmtLong(grandRecords);

export const DATA_CATEGORIES: DataCategory[] = categories;
export const ALL_DATASETS: Dataset[] = allDatasets;

export const GROWTH_DATA: GrowthPoint[] = [
  { period: '2024 Q1', datasets: 145, sizeTB: 80 },
  { period: '2024 Q2', datasets: 185, sizeTB: 130 },
  { period: '2024 Q3', datasets: 245, sizeTB: 195 },
  { period: '2024 Q4', datasets: 300, sizeTB: 250 },
  { period: '2025 Q1', datasets: 350, sizeTB: 290 },
  { period: '2025 Q2', datasets: allDatasets.length, sizeTB: totalTB },
];

export const PARTNERS: Partner[] = [
  { name: '新华医院', nameEn: 'Xinhua Hospital', type: '医院' },
  { name: '复旦大学', nameEn: 'Fudan University', type: '高校' },
  { name: '上海交通大学', nameEn: 'SJTU', type: '高校' },
  { name: '仁济医院', nameEn: 'Renji Hospital', type: '医院' },
  { name: '湖南儿童医院', nameEn: "Hunan Children's Hospital", type: '医院' },
  { name: '六院放射科', nameEn: 'Sixth Hospital', type: '医院' },
  { name: 'NIH', nameEn: 'National Institutes of Health', type: '国际机构' },
  { name: 'NCBI', nameEn: 'NCBI', type: '国际机构' },
  { name: 'EBI', nameEn: 'European Bioinformatics', type: '国际机构' },
  { name: 'PhysioNet', nameEn: 'PhysioNet', type: '开放数据' },
  { name: 'TCIA', nameEn: 'Cancer Imaging Archive', type: '开放数据' },
];

export const HERO_STATS: HeroStat[] = [
  { value: totalRecordsLong.value, unit: ' ' + totalRecordsLong.unit, label: '数据总量', labelEn: 'TOTAL DATA' },
  { value: allDatasets.length, unit: '', label: '数据集', labelEn: 'DATASETS' },
  { value: categories.length, unit: '', label: '数据领域', labelEn: 'DOMAINS' },
  { value: PARTNERS.length, unit: '+', label: '合作伙伴', labelEn: 'PARTNERS' },
];

// 全流程覆盖：每个应用阶段关联的数据领域（一个领域可服务多个阶段），
// 关联数据集数 / 数据量由真实数据实时统计。
const byId: Record<string, DataCategory> = {};
categories.forEach((c) => { byId[c.id] = c; });
const pipelineDef = [
  { name: '临床诊断', nameEn: 'Diagnosis', description: '辅助疾病诊断与鉴别，覆盖影像、病理、检验等场景',
    cats: ['knowledge', 'ehr', 'medtext', 'radiology', 'segmentation', 'rad_image_report', 'pathology', 'prenatal_hpo'] },
  { name: '科学研究', nameEn: 'Research', description: '支撑基础医学、转化医学与生物信息学研究',
    cats: ['knowledge', 'medtext', 'gene', 'single_cell', 'rna', 'cell_painting', 'pathology', 'vision_3d', 'vision_general', 'sports', 'audio_visual', 'video_grounding'] },
  { name: '新药研发', nameEn: 'Drug R&D', description: '靶点发现、化合物筛选、临床试验数据支持',
    cats: ['knowledge', 'clinical_trial', 'gene', 'nucleic_drug', 'cell_painting', 'single_cell', 'rna'] },
];
export const PIPELINE_STAGES: PipelineStage[] = pipelineDef.map((s) => {
  let ds = 0, rec = 0;
  s.cats.forEach((id) => {
    const c = byId[id];
    if (c) { ds += c.datasetCount; rec += c.recordSum; }
  });
  return {
    name: s.name, nameEn: s.nameEn, description: s.description,
    datasets: ds, recordSum: rec, recordDisp: fmtCount(rec),
  };
});
