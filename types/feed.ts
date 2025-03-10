export interface MomentData {
  id: string;
  title: string;
  description?: string;
  date?: Date;
  isHost: boolean;
  isPublic: boolean;
  host: {
    id: string;
    name: string;
    username: string;
    avatarUrl?: string;
    verified?: boolean;
  };
  metadata: {
    createdAt: string,
    going: number,
    interested: number,
    notGoing: number,
    views: number,
  };
  replyTo?: {
    username: string;
  };
}

export interface FeedEventData {
  title: string;
  description?: string;
  host: string;
  date?: Date;
  isHost: boolean;
}