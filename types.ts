
export interface Channel {
  id: string;
  name: string;
  avatar: string;
  subscribers: number;
}

export interface Comment {
  id: string;
  author: Channel;
  text: string;
  likes: number;
  replies: Comment[];
  timestamp: string;
}

export interface Video {
  id:string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  channel: Channel;
  views: string;
  uploadedAt: string;
  description: string;
  likes: number;
  dislikes: number;
  comments: Comment[];
  isShort: boolean;
  category: string;
}

export type Page = 'home' | 'shorts' | 'channel';