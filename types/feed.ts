export interface MomentData {
  id: string;
  title: string;
  description?: string;
  date?: Date;
  isHost: boolean;
  host: {
    id: string;
    username: string;
    name: string;
    verified?: boolean;
    profilePictureUrl?: string;
  };
  metadata?: {
    createdAt: string;
    going: number;
    interested: number;
    notGoing: number;
    views: number;
  };
}

export interface FeedEventData {
  title: string;
  description?: string;
  host: string;
  date?: Date;
  isHost: boolean;
}