import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useGame } from '../GameContext';

const lightColors = { bg: '#f9fafb', text: '#111827', muted: '#6b7280', card: '#ffffff', border: '#e5e7eb' };
const darkColors  = { bg: '#0d1117', text: '#e6edf3', muted: '#8b949e', card: '#161b22', border: '#30363d' };

export default function ChallengesScreen() {
  const { challenges, isDark } = useGame();
  const th   = isDark ? darkColors : lightColors;
  const done = challenges.filter(c => c.completed).length;

  return (
    <SafeAreaView style={[s.container, { backgroundColor: th.bg }]}>
      <ScrollView contentContainerStyle={s.scroll}>

        {/* Підсумок */}
        <View style={[s.header, { backgroundColor: th.card, borderColor: th.border }]}>
          <Text style={[s.headerLabel, { color: th.muted }]}>ВИКОНАНО</Text>
          <Text style={[s.headerCount, { color: '#3b82f6' }]}>{done}/{challenges.length}</Text>
        </View>

        {/* Список завдань */}
        {challenges.map(c => {
          const pct = c.target > 1
            ? Math.min(c.progress / c.target, 1)
            : (c.completed ? 1 : 0);

          return (
            <View
              key={c.id}
              style={[s.card, {
                backgroundColor: th.card,
                borderColor: c.completed ? '#22c55e' : th.border,
              }]}
            >
              <Text style={s.icon}>{c.completed ? '✅' : c.icon}</Text>

              <View style={s.info}>
                <Text style={[s.title, {
                  color: th.text,
                  textDecorationLine: c.completed ? 'line-through' : 'none',
                }]}>
                  {c.title}
                </Text>
                <Text style={[s.desc, { color: th.muted }]}>{c.description}</Text>
                {c.target > 1 && (
                  <View style={[s.barBg, { backgroundColor: isDark ? '#30363d' : '#e5e7eb' }]}>
                    <View style={[s.barFill, { width: `${Math.round(pct * 100)}%` }]} />
                  </View>
                )}
              </View>

              <Text style={[s.progress, { color: c.completed ? '#22c55e' : th.muted }]}>
                {c.target > 1 ? `${c.progress}/${c.target}` : (c.completed ? '✓' : '○')}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:   { flex: 1 },
  scroll:      { padding: 16, gap: 10 },
  header:      { borderRadius: 14, borderWidth: 1, padding: 16, alignItems: 'center', marginBottom: 4 },
  headerLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  headerCount: { fontSize: 40, fontWeight: 'bold' },
  card:        { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1, padding: 12, gap: 10 },
  icon:        { fontSize: 26, width: 38, textAlign: 'center' },
  info:        { flex: 1 },
  title:       { fontSize: 14, fontWeight: '700' },
  desc:        { fontSize: 12, marginTop: 2 },
  barBg:       { height: 4, borderRadius: 2, marginTop: 6, overflow: 'hidden' },
  barFill:     { height: '100%', backgroundColor: '#3b82f6', borderRadius: 2 },
  progress:    { fontSize: 13, fontWeight: '600', minWidth: 42, textAlign: 'right' },
});