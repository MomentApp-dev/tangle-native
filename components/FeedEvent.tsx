import { ThemedText } from "./ThemedText";
import { Box } from "native-base";

export function FeedEvent (props: FeedEventProps) {
    return (
        <Box>
            <ThemedText type="subtitle">
                {props.title}
            </ThemedText>
            <ThemedText type="host">
                {props.host}
            </ThemedText>
            <ThemedText>
                {props.description}
            </ThemedText>
        </Box>
    )
}

export type FeedEventProps = {
    title?: string,
    description?: string,
    host?: string,
}