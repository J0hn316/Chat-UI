import api from '../utils/api';

export type ChatUserRef = { _id: string; username: string };
export type Reaction = {
  user: { _id: string; username?: string } | string;
  emoji: string;
};

export type ChatMessage = {
  _id: string;
  sender: ChatUserRef;
  recipient: ChatUserRef;
  content: string;
  createdAt: string;
  readAt: string | null;
  reactions?: Reaction[];
};

export const sendMessage = async (
  recipientId: string,
  content: string
): Promise<ChatMessage> => {
  const res = await api.post('/messages', { recipientId, content });
  return res.data.message as ChatMessage;
};

export const getMessagesWithUser = async (
  otherUserId: string
): Promise<ChatMessage[]> => {
  const res = await api.get(`/messages/${otherUserId}`);
  return res.data.messages as ChatMessage[];
};

// Mark all messages from otherUserId → me as read
export const markMessagesRead = async (
  otherUserId: string
): Promise<string[]> => {
  const res = await api.post('/messages/mark-read', { otherUserId });
  return res.data.updatedIds as string[];
};

export const toggleMessageReaction = async (
  messageId: string,
  emoji: string
): Promise<ChatMessage> => {
  const res = await api.post(`/messages/${messageId}/reactions`, { emoji });
  return res.data.message;
};
