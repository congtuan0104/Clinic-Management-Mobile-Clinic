export interface IMedicalSupplies {
  id: number;
  medicineName: string;
  stock: number;
  price: number;
  expiredAt: string | null;
  expiry: string | null;
  vendor: string;
  description: string;
  isDeleted: boolean;
  unit: string;
  clinicId: string;
  note: string | null;
  categoryId: number;
  isDisabled: boolean;
  categoryName: string;
}

export interface IPostMedicalSuppliesParams {
  categoryId: number;
  clinicId: string;
  description: string | undefined;
  expiry: string | undefined;
  medicineName: string;
  stock: number;
  unit: string;
  vendor: string | undefined;
}

export interface IUpdateMedicalSuppliesParams {
  categoryId: number;
  clinicId: string;
  description: string | undefined;
  expiry: string | undefined;
  medicineName: string;
  stock: number;
  unit: string;
  vendor: string | undefined;
  isDisabled: boolean;
}
