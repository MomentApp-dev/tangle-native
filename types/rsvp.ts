export interface RSVP {
    id: string;
    userId: string;
    eventId: string;
    status: 'going' | 'maybe' | 'not_going';
    createdAt: string;
}