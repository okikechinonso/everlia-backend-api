export interface Language {
    name: string;
    iso_code: string;
    flag?: string;
    status?: "show" | "hide"; 
    createdAt?: Date; 
    updatedAt?: Date;
  }