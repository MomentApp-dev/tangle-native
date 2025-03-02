import { FeedEventData } from '../types/feed';

/**
 * Mock data generator for the event feed
 * @returns Array of FeedEvent objects
 * 
 * In a production environment, this would be replaced with:
 * - API calls to a backend service
 * - Data transformation layer
 * - Proper error handling
 */
export function generateFlatListData(): FeedEventData[] {
    const data: FeedEventData[] = [
        {
            title: "Code sesh for app that makes a lot of money",
            description: "Coding",
            host: "@jdog",
            isHost: true
        },
        {
            title: "Hello World",
            description: "Hello world",
            host: "@kabirkapur",
            isHost: false
        }, 
        {
            title: "Hello World",
            description: "Hello world",
            host: "@kabirkapur",
            isHost: false
        },
        {
            title: "gay sex orgy",
            description: "dick and balls",
            host: "@corykum",
            isHost: true
        },
        {
            title: "Code sesh for app that makes a lot of money",
            description: "Coding",
            host: "@jdog",
            isHost: true
        },
        {
            title: "Hello World",
            description: "Hello world",
            host: "@kabirkapur",
            isHost: false
        }, 
        {
            title: "Hello World",
            description: "Hello world",
            host: "@kabirkapur",
            isHost: false
        },
        {
            title: "gay sex orgy",
            description: "dick and balls",
            host: "@corykum",
            isHost: true

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