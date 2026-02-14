import { NavItem } from './nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'home',
    route: '/dashboard',
  },
  {
    navCap: 'Orders',
    divider: true,
  },
  {
    displayName: 'Available Orders',
    iconName: 'shopping-cart',
    route: '/orders/available',
  },
  {
    displayName: 'Active Orders',
    iconName: 'clock',
    route: '/orders/active',
  },
];
