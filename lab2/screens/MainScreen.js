import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

const STUDENT = 'Казмірчук Вероніка Володимирівна, ЗІПЗ-23-1';
const PAGE_SIZE = 10;

// Генератор тестових даних
const generateNews = (startId, count) =>
  Array.from({ length: count }, (_, i) => ({
    id: String(startId + i),
    title: `Заголовок новини ${startId + i}`,
    description: `Короткий опис новини ${startId + i}. Попередній перегляд статті з важливою інформацією.`,
    image: `https://picsum.photos/seed/${startId + i}/300/200`,
  }));

export default function MainScreen({ navigation }) {
  const [news, setNews] = useState(() => generateNews(1, PAGE_SIZE));
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextId, setNextId] = useState(PAGE_SIZE + 1);

  // Pull-to-Refresh: імітація мережевого запиту
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setNews(generateNews(1, PAGE_SIZE));
      setNextId(PAGE_SIZE + 1);
      setRefreshing(false);
    }, 1500);
  }, []);

  // Infinite Scroll: підвантаження нових даних
  const onEndReached = useCallback(() => {
    if (loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setNews(prev => [...prev, ...generateNews(nextId, PAGE_SIZE)]);
      setNextId(prev => prev + PAGE_SIZE);
      setLoadingMore(false);
    }, 1000);
  }, [loadingMore, nextId]);

  // Елемент списку
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.newsItem}
      onPress={() =>
        navigation.navigate('DetailsScreen', {
          id: item.id,
          title: item.title,
          description: item.description,
          image: item.image,
        })
      }
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  // ListHeaderComponent
  const ListHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuBtn}>
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>📰 Новини</Text>
      <View style={{ width: 40 }} />
    </View>
  );

  // ListFooterComponent
  const ListFooter = () =>
    loadingMore ? (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.footerText}>Завантаження...</Text>
      </View>
    ) : (
      <View style={styles.footer}>
        <Text style={styles.footerText}>{STUDENT}</Text>
      </View>
    );

  // ItemSeparatorComponent
  const ItemSeparator = () => <View style={styles.separator} />;

  return (
    <FlatList
      data={news}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      // Візуальні компоненти
      ListHeaderComponent={ListHeader}
      ListFooterComponent={ListFooter}
      ItemSeparatorComponent={ItemSeparator}
      // Pull-to-Refresh
      refreshing={refreshing}
      onRefresh={onRefresh}
      // Infinite Scroll
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      // Оптимізація рендерингу
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      windowSize={10}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e2e8f0',
    paddingTop: 44,
  },
  menuBtn: { padding: 4 },
  menuIcon: { fontSize: 24, color: '#007AFF' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  newsItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
    marginRight: 12,
  },
  textContainer: { flex: 1 },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
    lineHeight: 20,
  },
  description: { fontSize: 12, color: '#64748b', lineHeight: 17 },
  separator: {
    height: 0.5,
    backgroundColor: '#e2e8f0',
    marginLeft: 124,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  footerText: { fontSize: 11, color: '#94a3b8', fontStyle: 'italic' },
});