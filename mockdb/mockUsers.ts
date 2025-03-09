import { User } from '@/types/user';

export const users: User[] = [
    {
        id: 'user1',
        username: 'kabirkapur',
        name: 'Kabir Kapur',
        bio: 'Hello World enthusiast',
        isBusinessAccount: false,
    },
    {
        id: 'user2',
        username: 'jdog',
        name: 'JDog',
        bio: 'Making apps that make money',
        isBusinessAccount: false,
    },
    {
        id: 'user3',
        username: 'corykum',
        name: 'Cory Kum',
        bio: 'Living life to the fullest',
        isBusinessAccount: false,
    },
    {
        id: 'user4',
        username: 'oddfellowscafe',
        name: 'Odd Fellows Cafe',
        bio: 'Your neighborhood cafe & event space',
        isBusinessAccount: true,
    }
];