import { CATEGORY_TYPE } from '../enums';
import { IApiResponse, ICategory, ICreateCategoryPayload, IUpdateCategoryPayload } from '../types';
import { axiosClient } from "../config/axios";

export const categoryApi = {
  /**
   * @returns Lấy danh sách danh mục theo loại
   */
  getCategories(
    clinicId: string,
    params?: { name?: string; type?: CATEGORY_TYPE },
  ): Promise<IApiResponse<ICategory[]>> {
    return axiosClient.get(`/clinics/${clinicId}/categories`, { params: params });
  },

  getCategoryDetail(categoryId: number): Promise<IApiResponse<ICategory>> {
    return axiosClient.get(`/clinics/categories/${categoryId}`);
  },

  createCategory(clinicId: string, data: ICreateCategoryPayload): Promise<IApiResponse<ICategory>> {
    return axiosClient.post(`/clinics/${clinicId}/categories`, data);
  },

  updateCategory(cateId: number, data: IUpdateCategoryPayload): Promise<IApiResponse<ICategory>> {
    return axiosClient.put(`/clinics/categories/${cateId}`, data);
  },

  deleteCategory(cateId: number): Promise<IApiResponse<ICategory>> {
    return axiosClient.delete(`/clinics/categories/${cateId}`);
  },
};
