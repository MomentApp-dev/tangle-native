export interface FeedItem {
    id: string;
    type: 'created' | 'rsvpd';
    momentId: string;
    momentTitle: string;
    momentTime: string;
    createdAt: string;
    userId: string;
    rsvpStatus?: 'going' | 'maybe';
}