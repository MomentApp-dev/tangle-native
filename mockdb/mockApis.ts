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
  const goingMoments = rsvps
    .filter((rsvp: RSVP) => rsvp.userId === userId && rsvp.status === 'going')
    .map((rsvp: RSVP) => moments.find((moment: Moment) => moment.id === rsvp.momentId))
    .filter((moment: Moment | undefined) => moment !== undefined) as Moment[];
  
  const consideringMoments = rsvps
    .filter((rsvp: RSVP) => rsvp.userId === userId && rsvp.status === 'maybe')
    .map((rsvp: RSVP) => moments.find((moment: Moment) => moment.id === rsvp.momentId))
    .filter((moment: Moment | undefined) => moment !== undefined) as Moment[];
  
  return {
    hosting: hostedMoments.filter((moment: Moment) => moment.status === 'upcoming'),
    hosted: hostedMoments.filter((moment: Moment) => moment.status === 'past'),
    going: goingMoments.filter((moment: Moment) => moment.status === 'upcoming'),
    went: goingMoments.filter((moment: Moment) => moment.status === 'past'),
    considering: consideringMoments.filter((moment: Moment) => moment.status === 'upcoming')
  };
};

export const getMomentRSVPs = (momentId: string) => {
  return rsvps
    .filter((rsvp: RSVP) => rsvp.momentId === momentId)
    .map((rsvp: RSVP) => ({
      ...rsvp,
      user: getUser(rsvp.userId),
    }));
};

export const getRSVPCount = (momentId: string): number => {
  return rsvps.filter((rsvp: RSVP) => rsvp.momentId === momentId && rsvp.status === 'going').length;
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
    const moment = moments.find(m => m.id === rsvp.momentId);
    if (moment) {
      feedItems.push({
        id: `rsvpd-${rsvp.userId}-${moment.id}`,
        type: 'rsvpd',
        momentId: moment.id,
        momentTitle: moment.title,
        momentTime: moment.date,
        createdAt: rsvp.createdAt,
        userId: rsvp.userId,
        rsvpStatus: rsvp.status
      });
    }
  });

  // Sort by createdAt in descending order (newest first)
  return feedItems.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const searchMoments = async (query: string, filter: string = 'all') => {
  const normalizedQuery = query.toLowerCase();
  
  let results: any[] = [];
  
  switch (filter) {
    case 'moments':
      results = moments.filter(moment => 
        moment.title.toLowerCase().includes(normalizedQuery) ||
        moment.description?.toLowerCase().includes(normalizedQuery)
      );
      return results.map(moment => ({
        id: `created-${moment.id}`,
        type: 'created',
        momentId: moment.id,
        momentTitle: moment.title,
        momentTime: moment.date,
        createdAt: moment.createdAt,
        userId: moment.hostId
      }));
      
    case 'users':
      return users
        .filter(user => 
          user.name.toLowerCase().includes(normalizedQuery) ||
          user.username.toLowerCase().includes(normalizedQuery)
        )
        .map(user => ({
          id: `user-${user.id}`,
          type: 'user',
          userId: user.id,
          name: user.name,
          username: user.username,
          profilePictureUrl: user.profilePictureUrl
        }));
        
    case 'location':
      return moments
        .filter(moment => 
          moment.location.toLowerCase().includes(normalizedQuery)
        )
        .map(moment => ({
          id: `created-${moment.id}`,
          type: 'created',
          momentId: moment.id,
          momentTitle: moment.title,
          momentTime: moment.date,
          createdAt: moment.createdAt,
          userId: moment.hostId
        }));
        
    case 'all':
    default:
      // Search moments
      const momentResults = moments
        .filter(moment => 
          moment.title.toLowerCase().includes(normalizedQuery) ||
          moment.description?.toLowerCase().includes(normalizedQuery) ||
          moment.location.toLowerCase().includes(normalizedQuery)
        )
        .map(moment => ({
          id: `created-${moment.id}`,
          type: 'created',
          momentId: moment.id,
          momentTitle: moment.title,
          momentTime: moment.date,
          createdAt: moment.createdAt,
          userId: moment.hostId
        }));
        
      // Search users
      const userResults = users
        .filter(user => 
          user.name.toLowerCase().includes(normalizedQuery) ||
          user.username.toLowerCase().includes(normalizedQuery)
        )
        .map(user => ({
          id: `user-${user.id}`,
          type: 'user',
          userId: user.id,
          name: user.name,
          username: user.username,
          profilePictureUrl: user.profilePictureUrl
        }));
        
      return [...momentResults, ...userResults];
  }
};