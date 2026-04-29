export interface Motor {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  engine: string;
  color: string;
  image: string;
  images?: string[]; 
  minDp: number;
  status: "Tersedia" | "Terjual" | "Booking";
  branch?: string;
  transmission?: string;
  condition?: string;
}

export const motors: Motor[] = [
  {
    id: "m-001",
    brand: "Yamaha",
    model: "NMAX 155 ABS",
    year: 2022,
    price: 27500000,
    mileage: 12500,
    engine: "155cc",
    color: "Hitam Doff",
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800",
    minDp: 2500000,
    status: "Tersedia"
  },
  {
    id: "m-002",
    brand: "Honda",
    model: "Vario 160 CBSS",
    year: 2023,
    price: 24000000,
    mileage: 8200,
    engine: "157cc",
    color: "Merah",
    image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&q=80&w=800",
    minDp: 2000000,
    status: "Tersedia"
  },
  {
    id: "m-003",
    brand: "Honda",
    model: "Beat CBS ISS",
    year: 2021,
    price: 14500000,
    mileage: 21000,
    engine: "110cc",
    color: "Biru Putih",
    image: "https://images.unsplash.com/photo-1602434228300-a645bce471c6?auto=format&fit=crop&q=80&w=800",
    minDp: 1000000,
    status: "Tersedia"
  },
  {
    id: "m-004",
    brand: "Yamaha",
    model: "Aerox 155 Connected",
    year: 2022,
    price: 25000000,
    mileage: 15400,
    engine: "155cc",
    color: "Cyan Silver",
    image: "https://images.unsplash.com/photo-1596704107693-4fc6e7a6858e?auto=format&fit=crop&q=80&w=800",
    minDp: 2500000,
    status: "Tersedia"
  },
  {
    id: "m-005",
    brand: "Honda",
    model: "Scoopy Prestige",
    year: 2023,
    price: 20500000,
    mileage: 5000,
    engine: "110cc",
    color: "Putih",
    image: "https://images.unsplash.com/photo-1471343516543-de88d1d2ff2b?auto=format&fit=crop&q=80&w=800",
    minDp: 1500000,
    status: "Tersedia"
  },
  {
    id: "m-006",
    brand: "Kawasaki",
    model: "Ninja 250 FI",
    year: 2020,
    price: 45000000,
    mileage: 24000,
    engine: "250cc",
    color: "Hijau",
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3c87?auto=format&fit=crop&q=80&w=800",
    minDp: 6000000,
    status: "Booking"
  }
];

export const branches = [
  "Bumi Indah (Pusat)",
  "Jatiuwung",
  "Rajeg"
];
