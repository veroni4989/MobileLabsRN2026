import React from 'react';
import { View, Text, SectionList, StyleSheet } from 'react-native';

// Дані для SectionList — згруповані за першою літерою
const CONTACTS_DATA = [
  {
    title: 'А',
    data: [
      { id: '1', name: 'Андрієнко Олег', phone: '+380 50 111 22 33' },
      { id: '2', name: 'Антонова Марія', phone: '+380 67 222 33 44' },
    ],
  },
  {
    title: 'Б',
    data: [
      { id: '3', name: 'Бондаренко Іван', phone: '+380 73 333 44 55' },
      { id: '4', name: 'Борисенко Тетяна', phone: '+380 96 444 55 66' },
    ],
  },
  {
    title: 'В',
    data: [
      { id: '5', name: 'Василенко Петро', phone: '+380 50 555 66 77' },
      { id: '6', name: 'Власенко Олена', phone: '+380 67 666 77 88' },
    ],
  },
  {
    title: 'Г',
    data: [
      { id: '7', name: 'Гончаренко Юрій', phone: '+380 73 777 88 99' },
    ],
  },
  {
    title: 'Д',
    data: [
      { id: '8', name: 'Данилюк Надія', phone: '+380 96 888 99 00' },
      { id: '9', name: 'Дмитренко Сергій', phone: '+380 50 999 00 11' },
    ],
  },
  {
    title: 'К',
    data: [
      { id: '10', name: 'Казмірчук Вероніка', phone: '+380 67 100 20 30' },
      { id: '11', name: 'Коваленко Андрій', phone: '+380 73 200 30 40' },
    ],
  },
  {
    title: 'П',
    data: [
      { id: '12', name: 'Петренко Олексій', phone: '+380 96 300 40 50' },
    ],
  },
  {
    title: 'С',
    data: [
      { id: '13', name: 'Савченко Ірина', phone: '+380 50 400 50 60' },
      { id: '14', name: 'Сидоренко Максим', phone: '+380 67 500 60 70' },
    ],
  },
];

export default function ContactsScreen() {
  // renderItem — відображення одного контакту
  const renderItem = ({ item }) => (
    <View style={styles.contactItem}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name[0]}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.phone}>{item.phone}</Text>
      </View>
    </View>
  );

  // renderSectionHeader — заголовок секції
  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  // ItemSeparatorComponent — роздільник між елементами
  const ItemSeparator = () => <View style={styles.separator} />;

  return (
    <SectionList
      sections={CONTACTS_DATA}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      ItemSeparatorComponent={ItemSeparator}
      stickySectionHeadersEnabled
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  info: { flex: 1 },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  phone: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  separator: {
    height: 0.5,
    backgroundColor: '#e2e8f0',
    marginLeft: 72,
  },
});