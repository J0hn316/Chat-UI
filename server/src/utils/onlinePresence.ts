const onlineUserIds = new Set<string>();

export const addOnlineUser = (userId: string): void => {
  if (userId) onlineUserIds.add(userId);
};

export const removeOnlineUser = (userId: string): void => {
  if (userId) onlineUserIds.delete(userId);
};

export const getOnlineUserCount = (): number => {
  return onlineUserIds.size;
};
