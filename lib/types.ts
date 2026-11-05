
export type ServiceType = 'delivery' | 'pickup' | 'dine_in';
export type Language = 'ar' | 'en' | 'tr';
export type Allergen = 'gluten' | 'dairy' | 'nuts' | 'eggs' | 'soy' | 'sesame' | 'mustard';

export interface ProductOption {
  id: string;
  name: string;
  nameEn?: string;
  nameTr?: string; // Turkish
  price: number;
  image?: string;
  calories?: number;
}

export interface AddOn extends ProductOption {}

export interface Product {
  id: string;
  name: string;
  nameEn?: string; 
  nameTr?: string; // Turkish
  description: string;
  descriptionEn?: string;
  descriptionTr?: string; // Turkish
  price: number;
  image: string;
  category: string;
  calories?: number;
  
  // New Options
  sizes?: ProductOption[];
  drinkOptions?: ProductOption[];
  sideOptions?: ProductOption[];
  addOns?: AddOn[];
  customizations?: ProductOption[];
  allergens?: Allergen[];
}

export interface CartItem {
  instanceId: string;
  product: Product;
  quantity: number;
  
  // Selected Options
  selectedSize?: ProductOption;
  selectedDrink?: ProductOption;
  selectedSide?: ProductOption;
  selectedAddOns: string[]; 
  selectedCustomizations: string[]; 
}

export interface CustomerDetails {
  name: string;
  tableNumber?: string;
  notes?: string;
}

export const ServiceTypeLabels: Record<ServiceType, { ar: string; en: string; tr: string }> = {
  delivery: { ar: "توصيل لموقعي", en: "Delivery", tr: "Eve Teslim" },
  pickup: { ar: "أنا بأستلمه", en: "Pickup", tr: "Gelip Alacağım" },
  dine_in: { ar: "بآكل في الفرع", en: "Dine-in", tr: "Restoranda Ye" },
};
