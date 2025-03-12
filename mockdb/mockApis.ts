import { User } from '@/types/user';
import { Event } from '@/types/event';
import { RSVP } from '@/types/rsvp';
import { Follow } from '@/types/follow';
import { users } from './mockUsers';
import { events } from './mockEvents';
import { rsvps } from './mockRsvps';
import { follows } from './mockFollows';

// Use this to set the current user for development/testing purposes
let MOCK_CURRENT_USER_ID = 'user4';

export const getCurrentUser = async (): Promise<User | null> => {
  return users.find((user: User) => user.id === MOCK_CURRENT_USER_ID) || null;
};

export const getUser = (id: string): User | undefined => 
  users.find((user: User) => user.id === id);

export async function getUserByUsername(username: string): Promise<User | null> {
  return users.find((user: User) => user.username.toLowerCase() === username.toLowerCase()) || null;
} 

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