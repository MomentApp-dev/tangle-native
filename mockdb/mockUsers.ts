import { User } from '@/types/user';

export const users: User[] = [
    {
        id: 'user1',
        username: 'kabirkapur',
        name: 'Kabir Kapur',
        bio: 'Hello World enthusiast',
        isBusinessAccount: false,
        profilePictureUrl: 'https://api.uifaces.co/our-content/donated/FJkauyEa.jpg'
    },
    {
        id: 'user2',
        username: 'jdog',
        name: 'JDog',
        bio: 'Making apps that make money',
        isBusinessAccount: false,
        profilePictureUrl: 'https://api.uifaces.co/our-content/donated/KtCFjlD4.jpg'
    },
    {
        id: 'user3',
        username: 'corykum',
        name: 'Cory Kum',
        bio: 'Living life to the fullest',
        isBusinessAccount: false,
        profilePictureUrl: 'https://api.uifaces.co/our-content/donated/n4Ngwvi7.jpg'
    },
    {
        id: 'user4',
        username: 'oddfellowscafe',
        name: 'Odd Fellows Cafe',
        bio: 'Your neighborhood cafe & event space',
        isBusinessAccount: true,
        profilePictureUrl: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&auto=format&fit=crop&q=60'
    }
];