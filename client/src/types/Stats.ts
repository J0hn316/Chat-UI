export interface StatsResponse {
  usersCount: number;
  messagesCount: number;
  onlineUsers: number;
  messagesToday: number;
  // messagesLast7Days?: Array<{ date: string; count: number }>;
}
