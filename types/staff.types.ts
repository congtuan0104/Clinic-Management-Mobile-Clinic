export interface IClinicMember {
  id: string;
  users: 
  {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
  };
  
  role: {
    id: number;
    name: string;
  };
}
