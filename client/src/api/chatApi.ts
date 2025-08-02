import api from '../utils/api';

export type ChatMessage = {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  createdAt: string;
};

export async function sendMessage(
  recipientId: string,
  content: string
): Promise<ChatMessage> {
  const res = await api.post('/messages', { recipientId, content });
  return res.data.message;
}

export async function getMessagesWithUser(
  otherUserId: string
): Promise<ChatMessage[]> {
  const res = await api.get(`/messages/${otherUserId}`);
  return res.data.messages;
}
