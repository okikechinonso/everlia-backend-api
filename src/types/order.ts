export interface Order {
    user: string; 
    invoice?: number;
    cart: Cart[]; 
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
    deletedAt?: Date;
    isDeleted?: boolean;
    deletedBy?: string; 
  }

export type Cart = {
  image: string[];
  status: string;
  productId: string;
  title: string;
  category: {
    _id: string;
    name: {
      en: string;
    };
  };
  stock: number;
  id: string;
  variant: {
    discount: number;
    originalPrice: number;
    price: number;
  };
  price: number;
  originalPrice: number;
  quantity: number;
  itemTotal: number;
};