export interface Variant {
    [key: string]: string | number; // For dynamic keys like "63f078f54b86ed26b05281b2"
    originalPrice: number;
    price: number;
    quantity: number;
    discount: number;
    productId: string;
    barcode: string;
    sku: string;
    image: string;
  }