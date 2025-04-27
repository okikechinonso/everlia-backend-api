export interface Setting {
    name: string;
    setting: Record<string, any>;
    createdAt?: Date; 
    updatedAt?: Date; 
  }