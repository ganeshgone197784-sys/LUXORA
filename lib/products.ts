import type { Product } from '@/types/product';

export const unsplash = (id: string, w = 700) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

export const inr = (n: number) => '₹' + n.toLocaleString('en-IN');

// Demo products only - not real inventory.
export const products: Product[] = [
  { id: 1, name: 'Tailored Wool Blazer', gender: 'Men', category: 'Jackets', price: 18900, image: unsplash('1594938298603-c8148c4dae35'), sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'Charcoal'], stock: 8, description: 'A sharply cut blazer with a clean, structured line.', isNew: true },
  { id: 2, name: 'Crisp Poplin Shirt', gender: 'Men', category: 'Shirts', price: 5900, image: unsplash('1602810318383-e386cc2a3ccf'), sizes: ['S', 'M', 'L', 'XL'], colors: ['White', 'Ivory'], stock: 15, description: 'An everyday shirt with a refined collar.' },
  { id: 3, name: 'Essential Pima Tee', gender: 'Men', category: 'T-shirts', price: 2900, image: unsplash('1620799140408-edc6dcb6d633'), sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'White'], stock: 30, description: 'A soft, minimal tee with a relaxed drape.' },
  { id: 4, name: 'Pleated Trousers', gender: 'Men', category: 'Trousers', price: 7900, image: unsplash('1617137968427-85924c800a22'), sizes: ['30', '32', '34', '36'], colors: ['Charcoal', 'Sand'], stock: 12, description: 'High-waisted trousers with a tapered leg.', isNew: true },
  { id: 5, name: 'Leather Bomber Jacket', gender: 'Men', category: 'Jackets', price: 32900, image: unsplash('1551028719-00167b16eac5'), sizes: ['M', 'L', 'XL'], colors: ['Black'], stock: 4, description: 'A modern bomber with a clean, minimal finish.' },
  { id: 6, name: 'Evening Silk Dress', gender: 'Women', category: 'Dresses', price: 24900, image: unsplash('1496747611176-843222e1e57c'), sizes: ['XS', 'S', 'M', 'L'], colors: ['Black', 'Champagne'], stock: 6, description: 'A fluid evening dress with an elegant fall.', isNew: true },
  { id: 7, name: 'Draped Satin Top', gender: 'Women', category: 'Tops', price: 6900, image: unsplash('1469334031218-e382a71b716b'), sizes: ['XS', 'S', 'M', 'L'], colors: ['Ivory', 'Black'], stock: 14, description: 'A soft-draped top for day-to-night wear.' },
  { id: 8, name: 'Wide-Leg Trousers', gender: 'Women', category: 'Trousers', price: 8900, image: unsplash('1445205170230-053b83016050'), sizes: ['XS', 'S', 'M', 'L'], colors: ['Black', 'Camel'], stock: 10, description: 'Fluid, wide-leg trousers with a high rise.' },
  { id: 9, name: 'Structured Leather Handbag', gender: 'Women', category: 'Handbags', price: 27900, image: unsplash('1548036328-c9fa89d128fa'), sizes: ['One Size'], colors: ['Black', 'Tan'], stock: 5, description: 'A structured handbag with a polished gold-tone clasp.', isNew: true },
  { id: 10, name: 'Everyday Tote', gender: 'Women', category: 'Handbags', price: 14900, image: unsplash('1584917865442-de89df76afd3'), sizes: ['One Size'], colors: ['Black', 'Ivory'], stock: 9, description: 'A roomy tote that holds the day together.' },
  { id: 11, name: 'Tailored Longline Coat', gender: 'Women', category: 'Jackets', price: 29900, image: unsplash('1515886657613-9f3515b0c78f'), sizes: ['XS', 'S', 'M', 'L'], colors: ['Camel', 'Black'], stock: 3, description: 'A longline coat with sharp, clean tailoring.' },
  { id: 12, name: 'Gold-Tone Chain Belt', gender: 'Women', category: 'Accessories', price: 4900, image: unsplash('1434389677669-e08b4cac3105'), sizes: ['One Size'], colors: ['Gold'], stock: 20, description: 'A slim gold-tone belt to finish any look.' },
];
