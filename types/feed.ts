export interface FeedItem {
  id: string;
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

export interface FeedEvent {
  title: string;
  description?: string;
  host: string;
} 