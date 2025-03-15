import { Moment } from '@/types/moment';
import { users } from './mockUsers';

// Helper to get host info
const getHostInfo = (hostId: string) => {
  const host = users.find(u => u.id === hostId)!;
  return {
    id: host.id,
    username: host.username,
    name: host.name,
    verified: host.isBusinessAccount,
    profilePictureUrl: host.profilePictureUrl,
  };
};

export const moments: Moment[] = [
    {
      id: 'moment1',
      hostId: 'user4',
      title: 'Open Mic Night',
      description: 'Join us for an evening of local talent! All performers welcome.',
      date: '2024-03-15T19:00:00Z',
      maxCapacity: 50,
      location: 'Odd Fellows Cafe',
      status: 'upcoming',
      createdAt: '2024-02-01T08:00:00Z'
    },
    {
      id: 'moment2',
      hostId: 'user4',
      title: 'Coffee Tasting Workshop',
      description: 'Sample our new spring coffee selection. Learn about brewing methods.',
      date: '2024-03-20T15:00:00Z',
      maxCapacity: 20,
      location: 'Odd Fellows Cafe',
      status: 'upcoming',
      createdAt: '2024-02-05T09:00:00Z'
    },
    {
      id: 'moment3',
      hostId: 'user4',
      title: 'Poetry Reading',
      description: 'Monthly poetry night featuring local writers.',
      date: '2024-02-15T19:00:00Z',
      maxCapacity: 40,
      location: 'Odd Fellows Cafe',
      status: 'past',
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'moment4',
      hostId: 'user2',
      title: 'Hello World',
      description: 'Hello world',
      date: '2024-03-21T19:00:00Z',
      maxCapacity: 30,
      location: 'Virtual',
      status: 'upcoming',
      createdAt: '2024-02-10T08:00:00Z'
    },
    {
      id: 'moment5',
      hostId: 'user2',
      title: 'Hello World',
      description: 'Hello world',
      date: '2024-03-22T19:00:00Z',
      maxCapacity: 30,
      location: 'Virtual',
      status: 'upcoming',
      createdAt: '2024-02-11T08:00:00Z'
    },
    {
      id: 'moment6',
      hostId: 'user3',
      title: 'gay sex orgy',
      description: 'dick and balls',
      date: '2024-03-23T20:00:00Z',
      maxCapacity: 20,
      location: 'Secret Location',
      status: 'upcoming',
      createdAt: '2024-02-12T10:00:00Z'
    },
    {
      id: 'moment7',
      hostId: 'user1',
      title: 'Code sesh for app that makes a lot of money',
      description: 'Coding',
      date: '2024-03-24T15:00:00Z',
      maxCapacity: 10,
      location: 'Startup HQ',
      status: 'upcoming',
      createdAt: '2024-02-13T09:00:00Z'
    },
    {
      id: 'moment8',
      hostId: 'user2',
      title: 'Hello World',
      description: 'Hello world',
      date: '2024-03-25T19:00:00Z',
      maxCapacity: 30,
      location: 'Virtual',
      status: 'upcoming',
      createdAt: '2024-02-14T08:00:00Z'
    },
    {
      id: 'moment9',
      hostId: 'user2',
      title: 'Hello World',
      description: 'Hello world',
      date: '2024-03-26T19:00:00Z',
      maxCapacity: 30,
      location: 'Virtual',
      status: 'upcoming',
      createdAt: '2024-02-15T08:00:00Z'
    },
    {
      id: 'moment10',
      hostId: 'user3',
      title: 'gay sex orgy',
      description: 'dick and balls',
      date: '2024-03-27T20:00:00Z',
      maxCapacity: 20,
      location: 'Secret Location',
      status: 'upcoming',
      createdAt: '2024-02-16T10:00:00Z'
    }
]; 