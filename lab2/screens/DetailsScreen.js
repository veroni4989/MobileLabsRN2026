import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';

export default function DetailsScreen({ route }) {
  // Отримуємо параметри переданні з MainScreen
  const { title, description, image, id } = route.params;

  return (
    <ScrollView style={styles.container}>
      {/* Зображення новини */}
      <Image source={{ uri: image }} style={styles.image} />

      <View style={styles.content}>
        {/* Динамічний заголовок береться з route.params в App.js */}
        <Text style={styles.title}>{title}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.meta}>📅 17 травня 2025</Text>
          <Text style={styles.meta}>•</Text>
          <Text style={styles.meta}>3 хв читання</Text>
        </View>

        <Text style={styles.body}>{description}</Text>

        <Text style={styles.body}>
          Детальний текст новини #{id}. Цей матеріал підготовлено редакцією
          видання на основі перевірених джерел. Автор провів ретельне
          дослідження та зібрав усі необхідні факти.
        </Text>

        <Text style={styles.body}>
          Продовження тексту новини. Тут наведено додатковий контекст та
          коментарі експертів. Матеріал оновлено о 14:30.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 220,
    backgroundColor: '#e2e8f0',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
    lineHeight: 30,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  meta: {
    fontSize: 12,
    color: '#94a3b8',
  },
  body: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 26,
    marginBottom: 14,
  },
});