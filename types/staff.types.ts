export interface IClinicMember {
  id: string;
  users: 
  {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
    phone: string;
    address: string;
    gender: number;
    birthday: string;
  };
  
  role: {
    id: number;
    name: string;
  };
}
