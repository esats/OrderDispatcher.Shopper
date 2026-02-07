export interface ShopperProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  rating: number;
  totalOrders: number;
  memberSince: Date;
  zones: string[];
  vehicleType: string;
  preferences: ShopperPreferences;
}

export interface ShopperPreferences {
  notifications: boolean;
  autoAcceptBatches: boolean;
  preferredStores: string[];
  maxDistance: number;
  availabilitySchedule: AvailabilitySchedule[];
}

export interface AvailabilitySchedule {
  dayOfWeek: number; // 0-6
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  rating: number;
  completedOrders: number;
}
