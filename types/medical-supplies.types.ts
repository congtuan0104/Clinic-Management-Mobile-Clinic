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
