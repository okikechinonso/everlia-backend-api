export interface AttributeVariant {
    _id: string;
    status: "show" | "hide";
    name: object;
  }
  
  export interface Attribute {
    _id: string;
    type: "attribute" | "extra"; 
    status: "show" | "hide";
    title: object;
    name: object;
    variants: AttributeVariant[];
    option: "Dropdown" | "Radio" | "Checkbox";
    createdAt: Date;
    updatedAt: Date;
  }