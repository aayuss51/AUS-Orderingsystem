
export type Category = 'Breakfast' | 'Lunch' | 'Dinner' | 'Drinks' | 'Desserts';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  isAvailable: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export enum OrderStatus {
  PENDING = 'Pending',
  PREPARING = 'Preparing',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export interface Order {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  tableNumber: string;
  createdAt: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  tableNumber?: string;
}
