export interface RSVP {
    id: string;
    userId: string;
    momentId: string;
    status: 'going' | 'maybe';
    createdAt: string;
}