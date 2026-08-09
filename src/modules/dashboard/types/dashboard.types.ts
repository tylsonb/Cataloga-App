export type DashboardStats = {
  totalViews: number;
  totalWhatsappClicks: number;
  totalProducts: number;
  totalFavorites: number;
  topProducts: Array<{ id: string; name: string; view_count: number }>;
  viewsTimeline: Array<{ date: string; count: number }>;
};
