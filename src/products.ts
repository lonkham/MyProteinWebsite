export interface ProductVariant {
  size: string;
  price: string | number;
  flavors?: string[];
}

export interface Product {
  id: number;
  nameEn: string;
  nameMm: string;
  category: "Protein Powder" | "Creatine" | "Supplement" | "Accessories";
  inStock: boolean;
  image: string;
  image2?: string;
  images?: string[];
  variants: ProductVariant[];
}

