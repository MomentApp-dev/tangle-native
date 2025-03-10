import { Follow } from '@/types/follow';

export const follows: Follow[] = [
    {
        id: 'follow1',
        followerId: 'user1', // kabirkapur
        followedId: 'user2', // jdog
        createdAt: '2024-02-01T08:00:00Z',
    },
    {
        id: 'follow2',
        followerId: 'user1', // kabirkapur
        followedId: 'user3', // corykum
        createdAt: '2024-02-01T08:00:00Z',
    },
    {
        id: 'follow3',
        followerId: 'user2', // jdog
        followedId: 'user4', // oddfellowscafe
        createdAt: '2024-02-01T08:00:00Z',
    },
    {
        id: 'follow4',
        followerId: 'user3', // corykum
        followedId: 'user4', // oddfellowscafe
        createdAt: '2024-02-01T08:00:00Z',
    }
];
