export interface IAdmin {
    name: string; // Assuming `name` is an object with dynamic keys
    image?: string;
    address?: string;
    country?: string;
    city?: string;
    email: string;
    phone?: string;
    status?: "Active" | "Inactive";
    password: string;
    
    role: 
      | "Admin"
      | "Super Admin"
      | "Cashier"
      | "Manager"
      | "CEO"
      | "Driver"
      | "Security Guard"
      | "Accountant";
    joiningData?: Date;
    createdAt?: Date; 
    updatedAt?: Date;
    _id: string;
  }