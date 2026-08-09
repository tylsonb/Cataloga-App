export type AdminStats = {
  totalUsers: number;
  totalBusinesses: number;
  totalProducts: number;
  totalPublished: number;
};

export type AdminUser = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
};
