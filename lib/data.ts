export type ProductionPlan = {
  id: string;
  company: string;
  kode_part: string;
  month: string;
  year: string;
  stock_lalu?: number;
  stock_akhir: number;
  stock_minimum: number;
  stock_maximum: number;
  product_order_ids?: string[];
  work_order_ids?: string[];
  total_product_order?: number;
  total_work_order?: number;
};

export const ProductionPlans: ProductionPlan[] = [];

export type PO = {
  id: string;
  production_plan_id: string;
  company: string;
  kode_part: string;
  quantity: string;
  created_at: Date;
  updated_at: Date;
};

export const POList: PO[] = [];

export type Product = {
  NO: number;
  KODE_PART: string;
  No_PART: string;
  NAMA_PART: string;
  SPEC: string;
  TEBAL: number;
  PNJANG_SHEET: number;
  LEBAR_SHEET: number;
  TYPE_MTRL: string;
  LEBAR_SHEARG: number;
  TOL: string;
  LANGKAH_PITCH: number;
  LANGKAH_CAV: number;
  JUMLAH_PCS_PER_LBR: number;
  BERAT_per_LEMBAR: number;
  JUMLAH_Rjg_per_Lbr: number;
  JUMLAH_Pcs_per_Rjg: number;
  BERAT_per_RAJANG: number;
  BRUTTO: number;
  pcs_per_kg: number;
};

export const ProductList: Product[] = [];

export type WorkOrder = {
  id: string;
  production_plan_id: string;
  kode_part: string;
  quantity: string;
  created_at: string;
  updated_at: string;
}

export const WorkOrdersList: WorkOrder[] = [];

export type WorkOrderPlan = {
  id: string;
  production_plan_id: string;
  product: {
    kode_part: string;
    nama_part: string;
  }
  week_number: number;
  month: string;
  year: string;
  start_date: Date;
  end_date: Date;
  order_material_rjg?: number;
  order_material_kg?: number;
  start_production_date?: Date;
  end_production_date?: Date;
  start_plating_date?: Date;
  end_plating_date?: Date;
  deadline_date?: Date;
}
export const WorkOrderPlans: WorkOrderPlan[] = [];

export type WorkOrdersReport = {
  id: string;
  week_number: number;
  month: string;
  year: string;
  
  start_date: Date;
  end_date: Date;
  work_order_plans: WorkOrderPlan[];
}

export const WorkOrdersReportList: WorkOrdersReport[] = [];