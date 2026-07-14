export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  formattedPrice: string;
  mrp?: string;
  category: string;
  subcategory: string;
  images: string[];
  description: string;
  features: string[];
  isNewArrival?: boolean;
};

export const products: Product[] = [
  // Women
  {
    id: "w-001",
    name: "Silk Organza Saree",
    brand: "Manish Malhotra",
    price: 28990,
    formattedPrice: "₹28,990",
    mrp: "₹34,990",
    category: "women",
    subcategory: "Sarees & Lehengas",
    images: [
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
    ],
    description: "An exquisite silk organza saree featuring delicate hand-embroidery and a subtle shimmer. Perfect for evening soirées and grand celebrations. Curated by our AI stylist for high-impact elegance.",
    features: ["100% Pure Silk Organza", "Hand-embroidered borders", "Includes matching unstitched blouse piece", "Dry clean only"],
    isNewArrival: true,
  },
  {
    id: "w-002",
    name: "Cashmere Wrap Coat",
    brand: "Loro Piana",
    price: 42990,
    formattedPrice: "₹42,990",
    mrp: "₹52,990",
    category: "women",
    subcategory: "Blazers & Coats",
    images: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80",
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
    ],
    description: "The epitome of quiet luxury. This sumptuous cashmere wrap coat provides unparallelled warmth with a weightless feel. The belted waist offers a flattering, customizable silhouette.",
    features: ["100% Baby Cashmere", "Self-tie belt", "Oversized lapels", "Made in Italy"],
    isNewArrival: true,
  },
  {
    id: "w-003",
    name: "Velvet Evening Gown",
    brand: "Sabyasachi",
    price: 35990,
    formattedPrice: "₹35,990",
    category: "women",
    subcategory: "Dresses",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
    ],
    description: "A dramatic velvet evening gown that commands the room. Featuring a plunging neckline and a sweeping train, it combines heritage craftsmanship with modern cinematic appeal.",
    features: ["Silk-blend velvet", "Plunging V-neck", "Concealed back zip", "Fully lined"],
  },
  {
    id: "w-004",
    name: "Tailored Wool Trousers",
    brand: "Tom Ford",
    price: 12990,
    formattedPrice: "₹12,990",
    category: "women",
    subcategory: "Trousers",
    images: [
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80",
    ],
    description: "Impeccably tailored wide-leg trousers cut from crisp virgin wool. The high-rise waist and sharp front pleats elongate the silhouette perfectly.",
    features: ["100% Virgin Wool", "High-rise waist", "Front pleats", "Side slip pockets"],
  },
  {
    id: "w-005",
    name: "Silk Drape Blazer",
    brand: "Prada",
    price: 24990,
    formattedPrice: "₹24,990",
    category: "women",
    subcategory: "Blazers & Coats",
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
    ],
    description: "A masterclass in modern tailoring. This silk drape blazer features asymmetrical closures and architectural shoulders, blending masculine structures with feminine fluidity.",
    features: ["Silk-crepe fabric", "Asymmetrical button fastening", "Padded shoulders", "Made in Italy"],
  },
  {
    id: "w-006",
    name: "Embroidered Kurta Set",
    brand: "Anita Dongre",
    price: 18990,
    formattedPrice: "₹18,990",
    category: "women",
    subcategory: "Sarees & Lehengas",
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
    ],
    description: "A serene embroidered kurta set crafted in breathable chanderi. Delicate floral motifs and a coordinating dupatta complete this versatile festive look.",
    features: ["Chanderi silk blend", "Intricate zari embroidery", "Includes matching pants and dupatta", "Relaxed fit"],
  },

  // Men
  {
    id: "m-001",
    name: "Italian Merino Blazer",
    brand: "Ermenegildo Zegna",
    price: 54990,
    formattedPrice: "₹54,990",
    mrp: "₹68,990",
    category: "men",
    subcategory: "Tailoring",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    ],
    description: "A lightweight, unlined blazer crafted from the finest Italian merino wool. Perfect for smart-casual transitions and effortless luxury.",
    features: ["100% Merino Wool", "Unlined for breathability", "Patch pockets", "Made in Italy"],
    isNewArrival: true,
  },
  {
    id: "m-002",
    name: "Leather Derby Shoes",
    brand: "Church's",
    price: 24990,
    formattedPrice: "₹24,990",
    mrp: "₹32,990",
    category: "men",
    subcategory: "Footwear",
    images: [
      "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=800&q=80",
    ],
    description: "Classic English craftsmanship. These Leather Derby shoes are Goodyear welted for lifetime durability, featuring a polished binder finish for immediate elegance.",
    features: ["Premium calf leather", "Goodyear welted construction", "Leather sole", "Handcrafted in Northampton"],
    isNewArrival: true,
  },
  {
    id: "m-003",
    name: "Cashmere Turtleneck",
    brand: "Tom Ford",
    price: 32990,
    formattedPrice: "₹32,990",
    category: "men",
    subcategory: "Knitwear",
    images: [
      "https://images.unsplash.com/photo-1620684175317-062e245050f2?w=800&q=80",
    ],
    description: "The essential luxury knit. This fine-gauge cashmere turtleneck offers a slim fit that layers perfectly under tailoring or leather jackets.",
    features: ["100% Cashmere", "Ribbed collar and cuffs", "Slim fit", "Dry clean only"],
  },
  {
    id: "m-004",
    name: "Tailored Tuxedo",
    brand: "Gucci",
    price: 112990,
    formattedPrice: "₹1,12,990",
    category: "men",
    subcategory: "Tailoring",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    ],
    description: "A razor-sharp tuxedo featuring peak lapels and an impeccable cut. The ultimate statement for formal evening affairs.",
    features: ["Wool-mohair blend", "Satin peak lapels", "Single-button fastening", "Made in Italy"],
  },

  // Jewelry
  {
    id: "j-001",
    name: "Pearl Drop Earrings",
    brand: "Tanishq",
    price: 12990,
    formattedPrice: "₹12,990",
    mrp: "₹15,990",
    category: "jewelry",
    subcategory: "Earrings",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
      "https://images.unsplash.com/photo-1515562141589-67f0d4e2b60b?w=800&q=80",
    ],
    description: "Timeless pearl drop earrings set in 18k yellow gold. These elegant drops bring a touch of vintage glamour to contemporary silhouettes.",
    features: ["18k Yellow Gold", "Freshwater cultured pearls", "Diamond accents", "Post and butterfly back"],
    isNewArrival: true,
  },
  {
    id: "j-002",
    name: "Diamond Tennis Bracelet",
    brand: "Dior",
    price: 245990,
    formattedPrice: "₹2,45,990",
    category: "jewelry",
    subcategory: "Bracelets",
    images: [
      "https://images.unsplash.com/photo-1515562141589-67f0d4e2b60b?w=800&q=80",
    ],
    description: "A brilliant line of meticulously matched diamonds set in platinum. This tennis bracelet is a masterpiece of fluid flexibility and unyielding sparkle.",
    features: ["Platinum 950", "3.50 carats total diamond weight", "F-G color, VS clarity", "Secure box clasp"],
  },
  {
    id: "j-003",
    name: "Gold Chain Necklace",
    brand: "Cartier",
    price: 85990,
    formattedPrice: "₹85,990",
    category: "jewelry",
    subcategory: "Necklaces",
    images: [
      "https://images.unsplash.com/photo-1599643478514-4a11b51e0996?w=800&q=80",
    ],
    description: "A bold, heavy-link gold chain that serves as the perfect foundation for layering. Substantial yet comfortable for daily wear.",
    features: ["18k Solid Yellow Gold", "18-inch length", "Lobster clasp", "Signature maker's mark"],
  },
];

export function getProductsByCategory(category: string) {
  return products.filter((p) => p.category === category);
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

export function getNewArrivals() {
  return products.filter((p) => p.isNewArrival);
}
