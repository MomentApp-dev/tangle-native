import { Box, FlatList } from "native-base";
import { FlatListProps } from "react-native";
import { FeedEvent } from "./FeedEvent";
import { generateFlatListData } from "../utils/generateFlatListData";

export function FeedFlatList (props: FeedFlatListProps) {
    const data = generateFlatListData();

    return (
        <FlatList
            data={ data }
            renderItem={ ({ item }) => <FeedEvent title={item.title} description={ item.description } host={ item.host }/> }
        />
    );
}

export type FeedFlatListProps = { };