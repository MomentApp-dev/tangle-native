export interface User {
    id: string;
    username: string;
    name: string;
    bio: string;
    isBusinessAccount: boolean;
    profilePictureUrl?: string;
}