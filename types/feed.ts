export interface MomentData {
  title: string;
  description?: string;
  date?: Date;
  isPublic: boolean;
  host: string;
  startTime: number;
  endTime: number;
  location: string;
  metadata?: {
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