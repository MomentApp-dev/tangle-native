import { FeedEvent } from '../types/feed';

/**
 * Mock data generator for the event feed
 * @returns Array of FeedEvent objects
 * 
 * In a production environment, this would be replaced with:
 * - API calls to a backend service
 * - Data transformation layer
 * - Proper error handling
 */
export function generateFlatListData(): FeedEvent[] {
    const data: FeedEvent[] = [
        {
            title: "Code sesh for app that makes a lot of money",
            description: "Coding",
            host: "@jdog"
        },
        {
            title: "Hello World",
            description: "Hello world",
            host: "@kabirkapur"
        }, 
        {
            title: "Hello World",
            description: "Hello world",
            host: "@kabirkapur"
        },
        {
            title: "gay sex orgy",
            description: "dick and balls",
            host: "@corykum"
        }
    ];

    return data;
}

/**
 * Type definition for feed data items
 * @deprecated Use FeedEvent from '../types/feed' instead
 */
export type FeedDataItem = {
    title: string;
    host: string;
    description?: string;
}