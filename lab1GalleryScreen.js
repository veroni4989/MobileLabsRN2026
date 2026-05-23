import React from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 30) / 2;

const GALLERY_DATA = Array.from({ length: 10 }, (_, i) => ({ id: String(i + 1) }));

function GalleryItem() {
  return <View style={styles.galleryItem} />;
}

export default function GalleryScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={GALLERY_DATA}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        renderItem={() => <GalleryItem />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  listContent: { padding: 10 },
  row: { justifyContent: 'space-between', marginBottom: 10 },
  galleryItem: { width: ITEM_SIZE, height: ITEM_SIZE, backgroundColor: '#f2f2f2', borderRadius: 8, borderWidth: 0.5, borderColor: '#ddd' },
});
