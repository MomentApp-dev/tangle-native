import { User } from '@/types/user';
import { Event } from '@/types/event';
import { RSVP } from '@/types/rsvp';
import { Follow } from '@/types/follow';
import { MomentData } from '@/types/feed';
import { users } from './mockUsers';
import { events } from './mockEvents';
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

export const getUserEvents = (userId: string) => {
  const hostedEvents = events.filter((event: Event) => event.hostId === userId);
  const rsvpdEvents = rsvps
    .filter((rsvp: RSVP) => rsvp.userId === userId && rsvp.status === 'going')
    .map((rsvp: RSVP) => events.find((event: Event) => event.id === rsvp.eventId))
    .filter((event: Event | undefined) => event !== undefined) as Event[];
  
  return {
    hosting: hostedEvents.filter((event: Event) => event.status === 'upcoming'),
    hosted: hostedEvents.filter((event: Event) => event.status === 'past'),
    going: rsvpdEvents.filter((event: Event) => event.status === 'upcoming'),
    went: rsvpdEvents.filter((event: Event) => event.status === 'past'),
  };
};

export const getEventRSVPs = (eventId: string) => {
  return rsvps
    .filter((rsvp: RSVP) => rsvp.eventId === eventId)
    .map((rsvp: RSVP) => ({
      ...rsvp,
      user: getUser(rsvp.userId),
    }));
};

export const getRSVPCount = (eventId: string): number => {
  return rsvps.filter((rsvp: RSVP) => rsvp.eventId === eventId && rsvp.status === 'going').length;
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

export const getFeedData = (): MomentData[] => {
  const upcomingEvents = events.filter(event => event.status === 'upcoming');
  
  return upcomingEvents.map(event => {
    const host = users.find(u => u.id === event.hostId)!;
    const goingCount = rsvps.filter(r => r.eventId === event.id && r.status === 'going').length;
    const maybeCount = rsvps.filter(r => r.eventId === event.id && r.status === 'maybe').length;
    const notGoingCount = rsvps.filter(r => r.eventId === event.id && r.status === 'not_going').length;

    const momentData: MomentData = {
      id: event.id,
      title: event.title,
      description: event.description,
      date: new Date(event.date),
      isHost: true, // We'll update this when we have current user context
      host: {
        id: host.id,
        username: `@${host.username}`,
        name: host.name,
        verified: host.isBusinessAccount,
        profilePictureUrl: host.profilePictureUrl,
      },
      metadata: {
        createdAt: event.createdAt,
        going: goingCount,
        interested: maybeCount,
        notGoing: notGoingCount,
        views: Math.floor(Math.random() * 1000),
      }
    };

    return momentData;
  });
};