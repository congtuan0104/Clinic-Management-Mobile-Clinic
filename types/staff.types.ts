export interface IClinicMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isOwner: boolean;
  role: {
    id: number;
    name: string;
  };
}
