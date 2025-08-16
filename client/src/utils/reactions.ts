import type { ChatMessage, Reaction } from '../api/chatApi';

/** Normalize `user` (string | {_id}) to a string id. */
export const getUserId = (
  user: string | { _id: string } | undefined | null
): string => (typeof user === 'string' ? user : user?._id ?? '');

/** Does the current user already have this emoji on the message? */
export const hasMyReaction = (
  reactions: Reaction[] | undefined,
  me: string,
  emoji: string
): boolean =>
  (reactions ?? []).some(
    (reaction) => getUserId(reaction.user) === me && reaction.emoji === emoji
  );

/** Remove my reaction (if present). */
export const removeMyReaction = (
  reactions: Reaction[] | undefined,
  me: string,
  emoji: string
): Reaction[] =>
  (reactions ?? []).filter(
    (reaction) => !(getUserId(reaction.user) === me && reaction.emoji === emoji)
  );

/** Add my reaction. */
export const addMyReaction = (
  reactions: Reaction[] | undefined,
  me: string,
  emoji: string
): Reaction[] => [...(reactions ?? []), { user: { _id: me }, emoji }];

/** Optimistically toggle my reaction on a single message. */
export const togglerReactionLocal = (
  msg: ChatMessage,
  me: string,
  emoji: string
): ChatMessage => {
  return {
    ...msg,
    reactions: hasMyReaction(msg.reactions, me, emoji)
      ? removeMyReaction(msg.reactions, me, emoji)
      : addMyReaction(msg.reactions, me, emoji),
  };
};

/** Build a map of emoji -> count for display. */
export const countReactions = (
  reactions: Reaction[] | undefined
): Record<string, number> =>
  (reactions ?? []).reduce<Record<string, number>>((acc, reaction) => {
    acc[reaction.emoji] = (acc[reaction.emoji] ?? 0) + 1;
    return acc;
  }, {});

/** Set of emojis that the current user has used on this message. */
export const myReactionSet = (
  reactions: Reaction[] | undefined,
  me: string
): Set<string> =>
  new Set(
    (reactions ?? [])
      .filter((reaction) => getUserId(reaction.user) === me)
      .map((reaction) => reaction.emoji)
  );
