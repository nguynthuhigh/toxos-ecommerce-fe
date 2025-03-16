export interface Shop {
  _id: string;
  name: string;
  logo: string;
  description: string;
  phoneNumber: string;
  address: string;
  detailedAddress: string;
  user: User;
}

export interface User {
  email: string;
  password: string;
}
