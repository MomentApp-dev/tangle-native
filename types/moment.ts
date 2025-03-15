export interface Moment {
    id: string;
    hostId: string;
    title: string;
    description: string;
    date: string;
    maxCapacity: number;
    location: string;
    status: 'upcoming' | 'past';
    createdAt: string;
}