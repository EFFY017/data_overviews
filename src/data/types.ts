// 数据模型类型定义

/** mockData.ts 中后端返回的单条数据集原始记录 */
export interface MockRow {
  id: number;
  category: string;
  name: string;
  sizeRaw: string;
  sizeDisp: string | null;
  sizeBytes: number | null;
  sizeOk: boolean;
  description: string;
  cluster: string;
  clusterShort: string;
  owner: string;
  sample: string;
  recordCount: number | null;
  recordUnit: string;
  recordSource: string;
}

/** 卡片标签用的精选数据集 */
export interface FeaturedItem {
  name: string;
  exclusive: boolean;
}

/** 聚合后的数据领域 */
export interface DataCategory {
  id: string;
  name: string;
  nameEn: string;
  color: string;
  description: string;
  totalBytes: number;
  totalSize: number;
  datasetCount: number;
  sizedCount: number;
  recordSum: number;
  recordDisp: string;
  hasRecord: boolean;
  exclusiveCount: number;
  pctStorage: number;
  featured: FeaturedItem[];
}

/** 数据集浏览列表的单条记录 */
export interface Dataset {
  id: number;
  name: string;
  category: string;
  categoryName: string;
  categoryColor: string;
  size: string;
  sizeOk: boolean;
  records: string;
  recordUnit: string;
  sample: string;
  exclusive: boolean;
  description: string;
}

export interface HeroStat {
  value: number | string;
  unit: string;
  label: string;
  labelEn: string;
}

export interface GrowthPoint {
  period: string;
  datasets: number;
  sizeTB: number;
}

export interface Partner {
  name: string;
  nameEn: string;
  type: string;
}

export interface PipelineStage {
  name: string;
  nameEn: string;
  description: string;
  datasets: number;
  recordSum: number;
  recordDisp: string;
}
