export interface Coupon {
    title: Record<string, any>; 
    logo?: string;
    couponCode: string;
    startTime?: Date;
    endTime: Date;
    discountType?: Record<string, any>;
    minimumAmount: number;
    productType?: string;
    status?: "show" | "hide";
    createdAt?: Date; 
    updatedAt?: Date; 
  }
