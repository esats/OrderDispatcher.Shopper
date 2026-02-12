export enum OrderStatus {
  AVAILABLE = 'AVAILABLE',
  ACCEPTED = 'ACCEPTED',
  SHOPPING = 'SHOPPING',
  CHECKOUT = 'CHECKOUT',
  DELIVERING = 'DELIVERING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum OrderPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  storeId: string;
  storeName: string;
  storeAddress: string;
  status: OrderStatus;
  priority: OrderPriority;
  itemCount: number;
  estimatedPay: number;
  estimatedTime: number; // minutes
  distance: number; // miles
  items: OrderItem[];
  specialInstructions?: string;
  deliveryInstructions?: string;
  tip?: number;
  createdAt: Date;
  acceptedAt?: Date;
  completedAt?: Date;
  batch?: Batch;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage: string;
  category: string;
  quantity: number;
  unit: string; // 'each', 'lb', 'oz', etc.
  price: number;
  found: boolean;
  scanned: boolean;
  replacement?: Replacement;
  notes?: string;
}

export interface Replacement {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  reason: string; // 'out-of-stock', 'customer-requested', 'quality-issue'
}

export interface Batch {
  id: string;
  orderIds: string[];
  totalPay: number;
  totalDistance: number;
  estimatedTime: number;
}

export interface BasketDetailResponse {
  userId: string;
  storeId: string;
  basketMasterId: number;
  deliveryAddressId: number;
  items: BasketItem[];
}

export interface BasketItem {
  id?: number;
  name?: string;
  productId?: number;
  productName?: string;
  description?: string;
  productPrice: number;
  imageUrl?: string | null;
  quantity: number;
  unitType?: number;
  weight?: number;
}

export interface AssignToShopperSaveModel {
  shopperId: string;
  orderId: number;
}

export interface OrderModel {
  id: number;
  customerId: string;
  storeName: string;
  storeImageUrl: string;
  storeId: string;
  shopperId: string | null;
  basketMasterId: number;
  assignedAtUtc: string | null;
  status: number;
  subtotal: number | null;
  deliveryFee: number | null;
  serviceFee: number | null;
  tip: number | null;
  total: number | null;
  notes: string | null;
}

