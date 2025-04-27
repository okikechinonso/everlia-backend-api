import { IAdmin } from "./admin";
import { Customer } from "./customer";
export interface User {
    _id: string;
    name: string;
    email: string;
    address?: string;
    phone?: string;
    image?: string;
    password?: string;
  }

  export function ToUser(info: Customer | IAdmin): User {
    return {
      _id: info._id,
      name: info.name,
      email: info.email,
      address: info.address,
      phone: info.phone,
      image: info.image,
      password: info.password,
    };
  }