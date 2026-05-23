import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';

export default function CustomDrawer(props) {
  const { navigation, state } = props;
  const currentRoute = state.routes[state.index].name;

  const menuItems = [
    { name: 'Новини', icon: '📰' },
    { name: 'Контакти', icon: '👥' },
  ];

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>

      {/* Шапка: аватар + ПІБ + група */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://picsum.photos/seed/avatar77/80/80' }}
          style={styles.avatar}
        />
        <Text style={styles.firstName}>Казмірчук Вероніка</Text>
        <Text style={styles.lastName}>Володимирівна</Text>
        <View style={styles.groupBadge}>
          <Text style={styles.groupText}>ЗІПЗ-23-1</Text>
        </View>
      </View>

      {/* Роздільник */}
      <View style={styles.divider} />

      {/* Пункти меню */}
      <View style={styles.menu}>
        {menuItems.map((item) => {
          const isActive = currentRoute === item.name;
          return (
            <TouchableOpacity
              key={item.name}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => navigation.navigate(item.name)}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={[styles.menuText, isActive && styles.menuTextActive]}>
                {item.name}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>

    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 48,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 12,
  },
  firstName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastName: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    marginBottom: 8,
  },
  groupBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  groupText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 8,
  },
  menu: {
    paddingHorizontal: 10,
    paddingTop: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 2,
  },
  menuItemActive: {
    backgroundColor: '#EFF6FF',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 14,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
  },
  menuTextActive: {
    color: '#007AFF',
    fontWeight: '700',
  },
  activeIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007AFF',
  },
});