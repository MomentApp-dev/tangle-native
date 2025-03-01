export function generateFlatListData(): FeedDataItem[] {
    return [
        {
            title: "Fun event",
            description: "An awesome fun event hosted by your best friend! Bring drinks and shit",
            host: "@kabirkapur"
        }, 
        {
            title: "Hello World",
            description: "Hello world",
            host: "@kabirkapur"
        },
        {
            title: "gay sex orgy",
            host: "@corykum"
        }
    ];
}

export type FeedDataItem = {
    title: string;
    host: string;
    description?: string;
}