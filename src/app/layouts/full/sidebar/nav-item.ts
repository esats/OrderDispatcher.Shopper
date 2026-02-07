export interface NavItem {
  displayName?: string;
  iconName?: string;
  route?: string;
  children?: NavItem[];
  divider?: boolean;
  navCap?: string;
}
