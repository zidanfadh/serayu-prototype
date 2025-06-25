export type PO = {
  id: string;
  perusahaan: string;
  jumlahRanjang: number;
  beratTotalKg: number;
  catatan: string;
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