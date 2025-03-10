import { FeedEventData, MomentData } from '../types/feed';

/**
 * Mock data generator for the event feed
 * @returns Array of FeedEvent objects
 * 
 * In a production environment, this would be replaced with:
 * - API calls to a backend service
 * - Data transformation layer
 * - Proper error handling
 */
export function generateFlatListData(): MomentData[] {
    const data: MomentData[] = [
        {
            id: "1",
            title: "gay sex orgy",
            description: "dick and balls",
            host: {
                id: "1",
                username: "@corykum",
                name: "Cory Kum",
            },
            metadata: {
                createdAt: "2021-01-01",
                going: 0,
                interested: 0,
                notGoing: 243,
                views: 1000,
            },
            isHost: true

        },
        {
            id: "2",
            title: "Code sesh for app that makes a lot of money",
            description: "Coding",
            host: {
                id: "2",
                username: "@jdog",
                name: "Jack Couchkushion",
            },
            metadata: {
                createdAt: "2021-01-01",
                going: 10000,
                interested: 10000,
                notGoing: 0,
                views: 10000,
            },
            isHost: true
        },
        {
            id: "3",
            title: "Hello World",
            description: "Hello world",
            host: {
                id: "3",
                username: "@kabirkapur",
                name: "Kabir Kapur",
            },
            metadata: {
                createdAt: "2021-01-01",
                going: 10000,
                interested: 10000,
                notGoing: 0,
                views: 10000,
            },
            isHost: false
        }, 
        {
            id: "4",
            title: "Hello World",
            description: "Hello world",
            host: {
                id: "3",
                username: "@kabirkapur",
                name: "Kabir Kapur",
            },
            metadata: {
                createdAt: "2021-01-01",
                going: 10000,
                interested: 10000,
                notGoing: 0,
                views: 10000,
            },
            isHost: false
        }, 
        {
            id: "5",
            title: "gay sex orgy",
            description: "dick and balls",
            host: {
                id: "1",
                username: "@corykum",
                name: "Cory Kum",
            },
            metadata: {
                createdAt: "2021-01-01",
                going: 0,
                interested: 0,
                notGoing: 243,
                views: 1000,
            },
            isHost: true

        },
        {
            id: "6",
            title: "Code sesh for app that makes a lot of money",
            description: "Coding",
            host: {
                id: "2",
                username: "@jdog",
                name: "Jack Couchkushion",
            },
            metadata: {
                createdAt: "2021-01-01",
                going: 10000,
                interested: 10000,
                notGoing: 0,
                views: 10000,
            },
            isHost: true
        },
        {
            id: "7",
            title: "Hello World",
            description: "Hello world",
            host: {
                id: "3",
                username: "@kabirkapur",
                name: "Kabir Kapur",
            },
            metadata: {
                createdAt: "2021-01-01",
                going: 10000,
                interested: 10000,
                notGoing: 0,
                views: 10000,
            },
            isHost: false
        },
        {
            id: "8",
            title: "Hello World",
            description: "Hello world",
            host: {
                id: "3",
                username: "@kabirkapur",
                name: "Kabir Kapur",
            },
            metadata: {
                createdAt: "2021-01-01",
                going: 10000,
                interested: 10000,
                notGoing: 0,
                views: 10000,
            },
            isHost: false
        },
        {
            id: "9",
            title: "gay sex orgy",
            description: "dick and balls",
            host: {
                id: "1",
                username: "@corykum",
                name: "Cory Kum",
            },
            metadata: {
                createdAt: "2021-01-01",
                going: 0,
                interested: 0,
                notGoing: 243,
                views: 1000,
            },
            isHost: true

        },
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