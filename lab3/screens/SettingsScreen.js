import React from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  SafeAreaView, Switch, TouchableOpacity, Alert,
} from 'react-native';
import { useGame } from '../GameContext';

const lightColors = { bg: '#f9fafb', text: '#111827', muted: '#6b7280', card: '#ffffff', border: '#e5e7eb' };
const darkColors  = { bg: '#0d1117', text: '#e6edf3', muted: '#8b949e', card: '#161b22', border: '#30363d' };

export default function SettingsScreen() {
  const { score, challenges, isDark, toggleTheme, resetGame } = useGame();
  const th   = isDark ? darkColors : lightColors;
  const done = challenges.filter(c => c.completed).length;
  const pct  = Math.round((done / challenges.length) * 100);

  const handleReset = () =>
    Alert.alert(
      'Скинути прогрес',
      'Весь прогрес та очки будуть видалені. Продовжити?',
      [
        { text: 'Скасувати', style: 'cancel' },
        { text: 'Скинути',   style: 'destructive', onPress: resetGame },
      ]
    );

  return (
    <SafeAreaView style={[s.container, { backgroundColor: th.bg }]}>
      <ScrollView>

        {/* Статистика */}
        <Text style={[s.sectionTitle, { color: th.muted }]}>СТАТИСТИКА</Text>
        <View style={[s.section, { backgroundColor: th.card, borderColor: th.border }]}>
          <View style={s.statsRow}>
            {[
              { label: 'Очки',     value: score },
              { label: 'Виконано', value: `${done}/${challenges.length}` },
              { label: 'Прогрес',  value: `${pct}%` },
            ].map(item => (
              <View key={item.label} style={[s.statCard, {
                backgroundColor: isDark ? '#1c2128' : '#f3f4f6',
                borderColor: th.border,
              }]}>
                <Text style={[s.statValue, { color: th.text  }]}>{item.value}</Text>
                <Text style={[s.statLabel, { color: th.muted }]}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Вигляд */}
        <Text style={[s.sectionTitle, { color: th.muted }]}>ВИГЛЯД</Text>
        <View style={[s.section, { backgroundColor: th.card, borderColor: th.border }]}>
          <View style={s.row}>
            <Text style={[s.rowText, { color: th.text }]}>🌙 Темна тема</Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* Завдання */}
        <Text style={[s.sectionTitle, { color: th.muted }]}>ЗАВДАННЯ</Text>
        <View style={[s.section, { backgroundColor: th.card, borderColor: th.border }]}>
          {challenges.map((c, i) => (
            <View
              key={c.id}
              style={[
                s.challengeRow,
                i < challenges.length - 1 && { borderBottomWidth: 0.5, borderBottomColor: th.border },
              ]}
            >
              <Text style={{ fontSize: 20 }}>{c.completed ? '✅' : c.icon}</Text>
              <View style={{ flex: 1, marginHorizontal: 12 }}>
                <Text style={[s.challengeTitle, { color: th.text }]}>{c.title}</Text>
                {c.target > 1 && (
                  <Text style={{ fontSize: 11, color: th.muted }}>{c.progress}/{c.target}</Text>
                )}
              </View>
              <Text style={{ fontSize: 12, fontWeight: '600', color: c.completed ? '#22c55e' : th.muted }}>
                {c.completed ? 'Виконано' : 'В процесі'}
              </Text>
            </View>
          ))}
        </View>

        {/* Скинути */}
        <TouchableOpacity style={s.resetBtn} onPress={handleReset} activeOpacity={0.75}>
          <Text style={s.resetText}>🗑️ Скинути прогрес</Text>
        </TouchableOpacity>

        <Text style={[s.footer, { color: th.muted }]}>Gesture Clicker · Лабораторна робота №3</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:     { flex: 1 },
  sectionTitle:  { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginTop: 20, marginBottom: 6, marginHorizontal: 16 },
  section:       { marginHorizontal: 16, borderRadius: 14, borderWidth: 1, padding: 16 },
  statsRow:      { flexDirection: 'row', gap: 10 },
  statCard:      { flex: 1, borderRadius: 10, borderWidth: 1, padding: 12, alignItems: 'center' },
  statValue:     { fontSize: 22, fontWeight: 'bold' },
  statLabel:     { fontSize: 10, marginTop: 2 },
  row:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowText:       { fontSize: 16, fontWeight: '600' },
  challengeRow:  { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  challengeTitle:{ fontSize: 13, fontWeight: '600' },
  resetBtn:      { margin: 16, marginTop: 24, backgroundColor: '#fee2e2', borderRadius: 12, padding: 14, alignItems: 'center' },
  resetText:     { color: '#dc2626', fontWeight: '700', fontSize: 15 },
  footer:        { textAlign: 'center', fontStyle: 'italic', fontSize: 11, padding: 16, paddingBottom: 32 },
});