import React from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import type { Book } from "../types";
import { BookCard } from "./BookCard";

interface Props {
  data: Book[];
  onPressBook: (b: Book) => void;
  ListEmptyComponent?: React.ReactElement;
  refreshing?: boolean;     // BT9.6
  onRefresh?: () => void;   // có truyền thì bật kéo-để-làm-mới
}

export function BookGrid({ data, onPressBook, ListEmptyComponent, refreshing = false, onRefresh }: Props) {
  return (
    <FlatList
      data={data}
      keyExtractor={(b) => String(b.id)}
      numColumns={2}
      columnWrapperStyle={{ gap: 12 }}
      contentContainerStyle={s.content}
      ListEmptyComponent={ListEmptyComponent}
      refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : undefined}
      renderItem={({ item }) => (
        <View style={{ flex: 1 }}><BookCard book={item} onPress={onPressBook} /></View>
      )}
    />
  );
}
const s = StyleSheet.create({ content: { padding: 16, gap: 12, paddingBottom: 90, flexGrow: 1 } });
