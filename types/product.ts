export type Gender = 'Men' | 'Women';

export interface Product {
  id: number;
  name: string;
  gender: Gender;
  category: string;
  price: number; // INR
  image: string;
  sizes: string[];
  colors: string[];
  stock: number;
  description: string;
  isNew?: boolean;
}

export interface CartItem {
  id: number;
  size: string;
  color: string;
  qty: number;
}

export type SortKey = '' | 'asc' | 'desc';
