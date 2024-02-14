/**
 * Gói dịch vụ khám bệnh của phòng khám
 */
export interface IClinicService {
  id: number;
  clinicId: string;
  serviceName: string;
  price: number;
  categoryId?: number;
  categoryName?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  isDisabled: boolean;
  disabledAt?: string;
}

export interface IPostClinicServiceParams {
  serviceName: string;
  price: number;
  description?: string;
  categoryId?: number;
  isDisabled: boolean;
}
