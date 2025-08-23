export interface StatsResponse {
  usersCount: number;
  messagesCount: number;
  // optional future fields:
  // onlineUsers?: number;
  // messagesToday?: number;
  // messagesLast7Days?: Array<{ date: string; count: number }>;
}
