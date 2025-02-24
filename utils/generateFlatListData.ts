export function generateFlatListData(): FeedDataItem[] {
    return [
        {
            title: "Hello World",
            description: "Hello world",
            host: "hosted by kabirkapur"
        }, 
        {
            title: "Hello World",
            description: "Hello world",
            host: "hosted by kabirkapur"
        },
        {
            title: "gay sex orgy",
            host: "corykum"
        }
    ];
}

export type FeedDataItem = {
    title: string;
    host: string;
    description?: string;
}