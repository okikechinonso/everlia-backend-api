export interface Category {
    name: Record<string, any>; 
    description?: Record<string, any>;
    slug?: string;
    parentId?: string;
    parentName?: string;
    id?: string;
    icon?: string;
    status?: "show" | "hide"; 
    createdAt?: Date; 
    updatedAt?: Date;
    _id: string; 
  }