export interface IRole {
  id: number;
  name: string;
  description: string;
  rolePermissions: IRolePermission[];
}

export interface IRolePermission {
  id: number;
  optionName: string;
  description: string;
}

export interface IRoleCreate {
  name: string;
  description: string;
}
