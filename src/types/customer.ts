export interface Customer {
    _id: string;
    name: string;
    image?: string;
    address?: string;
    country?: string;
    city?: string;
    email: string;
    phone?: string;
    password?: string;
    createdAt?: Date; // Added for `timestamps: true`
    updatedAt?: Date; // Added for `timestamps: true`
  }