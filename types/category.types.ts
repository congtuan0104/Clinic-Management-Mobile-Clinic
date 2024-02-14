import { CATEGORY_TYPE } from '../enums';
export interface ICategory {
    id: number;
    name: string;
    type: CATEGORY_TYPE;
    note?: string;
    clinicId: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    isDisabled: boolean;
    disabledAt: string;
  }

  export interface IUpdateCategoryPayload {
    name: string;
    note?: string;
    description?: string;
  }
  
  export interface ICreateCategoryPayload extends IUpdateCategoryPayload {
    type: CATEGORY_TYPE;
  }
  