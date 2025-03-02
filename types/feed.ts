export interface FeedItemData {
  id: string;
  title: string;
  description?: string;
  host: string;
  isHost: boolean;
  author: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
    verified?: boolean;
  };
  content: {
    text: string;
    media?: {
      type: 'image' | 'video';
      url: string;
    }[];
  };
  metadata: {
    createdAt: string;
    likes: number;
    replies: number;
    reposts: number;
    views: number;
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