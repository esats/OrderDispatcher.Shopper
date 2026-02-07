export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  rating: number;
  deliveryInstructions?: string;
}

export interface ChatMessage {
  id: string;
  orderId: string;
  senderId: string;
  senderType: 'shopper' | 'customer';
  message: string;
  timestamp: Date;
  read: boolean;
}
