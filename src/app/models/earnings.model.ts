export interface DailyEarnings {
  date: Date;
  ordersCompleted: number;
  basePay: number;
  tips: number;
  bonuses: number;
  total: number;
  hours: number;
}

export interface WeeklyEarnings {
  weekStart: Date;
  weekEnd: Date;
  dailyEarnings: DailyEarnings[];
  totalOrders: number;
  totalEarnings: number;
  totalHours: number;
  averagePerOrder: number;
  averagePerHour: number;
}

export interface EarningsBreakdown {
  basePay: number;
  tips: number;
  bonuses: number;
  adjustments: number;
  total: number;
}
