export interface Order {
    user: string; 
    invoice?: number;
    cart: Record<string, any>[]; 
    user_info?: {
      name?: string;
      email?: string;
      contact?: string;
      address?: string;
      city?: string;
      country?: string;
      location?: string;
      area?: string;
      zipCode?: string;
    };
    subTotal: number;
    shippingCost: number;
    discount: number;
    total: number;
    shippingOption?: string;
    paymentMethod: string; 
    paymentReceipt: string;
    cardInfo?: Record<string, any>; // Assuming `cardInfo` is an object
    status?: "Pending" | "Processing" | "Delivered" | "Cancel"; // Enum values for `status`
    createdAt?: Date; 
    updatedAt?: Date; 
  }