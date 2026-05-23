import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

const NEWS_DATA = Array.from({ length: 8 }, (_, i) => ({
  id: String(i + 1),
  title: 'Заголовок новини',
  date: 'Дата новини',
  text: 'Короткий текст новини',
}));

function NewsItem({ item }) {
  return (
    <View style={styles.newsItem}>
      <View style={styles.imagePlaceholder}>
        <Image
          source={{ uri: `https://picsum.photos/seed/${item.id}/70/70` }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle}>{item.title}</Text>
        <Text style={styles.newsDate}>{item.date}</Text>
        <Text style={styles.newsText}>{item.text}</Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Новини</Text>
      <FlatList
        data={NEWS_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NewsItem item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  screenTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 12 },
  newsItem: { flexDirection: 'row', padding: 10, borderBottomWidth: 0.5, borderBottomColor: '#e0e0e0', alignItems: 'flex-start' },
  imagePlaceholder: { width: 70, height: 70, backgroundColor: '#e0e0e0', borderRadius: 4, overflow: 'hidden', marginRight: 10 },
  image: { width: 70, height: 70 },
  newsContent: { flex: 1 },
  newsTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
  newsDate: { fontSize: 12, color: '#999', marginBottom: 4 },
  newsText: { fontSize: 12, color: '#555' },
});
