import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from 'expo-router';
import { SearchResult } from '@/components/SearchResult';
import { searchMoments } from '@/mockdb/mockApis';

type FilterOption = 'all' | 'moments' | 'users';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleSearch = useCallback(async (query: string, filter: FilterOption) => {
    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }
    const results = await searchMoments(query, filter);
    setSearchResults(results);
  }, []);

  const handleFilterPress = (filter: FilterOption) => {
    setActiveFilter(filter);
    handleSearch(searchQuery, filter);
  };

  const renderFilterButton = (filter: FilterOption, label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === filter && styles.filterButtonActive
      ]}
      onPress={() => handleFilterPress(filter)}
    >
      <Text style={[
        styles.filterButtonText,
        activeFilter === filter && styles.filterButtonTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <IconSymbol name="magnifyingglass" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search moments..."
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              handleSearch(text, activeFilter);
            }}
            autoFocus
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <View style={styles.filtersScrollContent}>
          {renderFilterButton('all', 'All')}
          {renderFilterButton('users', 'Users')}
          {renderFilterButton('moments', 'Moments')}
        </View>
      </View>

      <FlatList
        data={searchResults}
        renderItem={({ item }) => <SearchResult item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.resultsList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {searchQuery.length > 0 ? 'No results found' : 'Start typing to search'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#DBDBDB',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#000',
  },
  filtersContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#DBDBDB',
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  filtersScrollContent: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginHorizontal: 4,
  },
  filterButtonActive: {
    backgroundColor: '#000',
  },
  filterButtonText: {
    fontSize: 15,
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  resultsList: {
    paddingTop: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
  },
}); 