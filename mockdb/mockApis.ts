import { User } from '@/types/user';
import { Moment } from '@/types/moment';
import { RSVP } from '@/types/rsvp';
import { Follow } from '@/types/follow';
import { FeedItem } from '@/types/feedItem';
import { users } from './mockUsers';
import { moments } from './mockMoments';
import { rsvps } from './mockRsvps';
import { follows } from './mockFollows';

// Use this to set the current user for development/testing purposes
let MOCK_CURRENT_USER_ID = 'user2';

export const getCurrentUser = async (): Promise<User | null> => {
  return users.find((user: User) => user.id === MOCK_CURRENT_USER_ID) || null;
};

export const getUser = (id: string): User | undefined => 
  users.find((user: User) => user.id === id);

export const getUserByUsername = async (username: string) => {
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (!user) {
    throw new Error(`User not found: ${username}`);
  }
  return user;
};

export const getMoment = (id: string): Moment | undefined =>
  moments.find((moment: Moment) => moment.id === id);

export const getUserMoments = (userId: string) => {
  const hostedMoments = moments.filter((moment: Moment) => moment.hostId === userId);
  const rsvpdMoments = rsvps
    .filter((rsvp: RSVP) => rsvp.userId === userId && rsvp.status === 'going')
    .map((rsvp: RSVP) => moments.find((moment: Moment) => moment.id === rsvp.eventId))
    .filter((moment: Moment | undefined) => moment !== undefined) as Moment[];
  
  return {
    hosting: hostedMoments.filter((moment: Moment) => moment.status === 'upcoming'),
    hosted: hostedMoments.filter((moment: Moment) => moment.status === 'past'),
    going: rsvpdMoments.filter((moment: Moment) => moment.status === 'upcoming'),
    went: rsvpdMoments.filter((moment: Moment) => moment.status === 'past'),
  };
};

export const getMomentRSVPs = (momentId: string) => {
  return rsvps
    .filter((rsvp: RSVP) => rsvp.eventId === momentId)
    .map((rsvp: RSVP) => ({
      ...rsvp,
      user: getUser(rsvp.userId),
    }));
};

export const getRSVPCount = (momentId: string): number => {
  return rsvps.filter((rsvp: RSVP) => rsvp.eventId === momentId && rsvp.status === 'going').length;
};

export const getFollowers = (userId: string): (User | undefined)[] => {
  return follows
    .filter((follow: Follow) => follow.followedId === userId)
    .map((follow: Follow) => getUser(follow.followerId));
};

export const getFollowing = (userId: string): (User | undefined)[] => {
  return follows
    .filter((follow: Follow) => follow.followerId === userId)
    .map((follow: Follow) => getUser(follow.followedId));
};

export const getFollowCounts = (userId: string) => {
  return {
    followers: follows.filter((follow: Follow) => follow.followedId === userId).length,
    following: follows.filter((follow: Follow) => follow.followerId === userId).length,
  };
};

export const isFollowing = (followerId: string, followedId: string): boolean => {
  return follows.some(
    (follow: Follow) => follow.followerId === followerId && follow.followedId === followedId
  );
};

export const getFeedItems = async (): Promise<FeedItem[]> => {
  const feedItems: FeedItem[] = [];

  moments.forEach(moment => {
    feedItems.push({
      id: `created-${moment.id}`,
      type: 'created',
      momentId: moment.id,
      momentTitle: moment.title,
      momentTime: moment.date,
      createdAt: moment.createdAt,
      userId: moment.hostId
    });
  });

  rsvps.forEach(rsvp => {
    const moment = moments.find(m => m.id === rsvp.eventId);
    if (moment) {
      feedItems.push({
        id: `rsvpd-${rsvp.userId}-${moment.id}`,
        type: 'rsvpd',
        momentId: moment.id,
        momentTitle: moment.title,
        momentTime: moment.date,
        createdAt: rsvp.createdAt,
        userId: rsvp.userId
      });
    }
  });

  // Sort by createdAt in descending order (newest first)
  return feedItems.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};