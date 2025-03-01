import { ThemedText } from "./ThemedText";
import { View } from "react-native";
import { StyleSheet } from "react-native";

export function FeedEvent (props: FeedEventProps) {
    return (
        <View style={styles.feedEventView}>
            <View>
                <ThemedText type="subtitle" style={styles.feedEventText}>
                    {props.title}
                </ThemedText>
                <ThemedText type="host" style={styles.feedEventText}>
                    {props.host}
                </ThemedText>
            </View>
            {props.description && <ThemedText style={styles.feedEventText}>
                {props.description}
            </ThemedText>}
        </View>
    )
}

const styles = StyleSheet.create({
    feedEventView: {
        flex: 1,
        alignItems: "flex-start",
        paddingLeft: 16,
        paddingVertical: 8, // Adds space inside the top and bottom lines
        borderTopWidth: 1, // Thickness of top line
        borderBottomWidth: 1, // Thickness of bottom line
        borderColor: "#ccc", // Color of the lines (adjust as needed)
    },
    titleHostContainer: {
        flexDirection: "row", // Arrange title & host horizontally
        alignItems: "center", // Align text vertically
    },
    hostText: {
        marginLeft: 8, // Add space between title and host
        fontStyle: "italic", // Optional: Differentiate the host text
    },
    feedEventText: {
        alignSelf: "flex-start"
    }
})

export type FeedEventProps = {
    title?: string,
    description?: string,
    host?: string,
}