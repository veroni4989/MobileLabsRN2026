import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { GestureDetector, Gesture, Directions } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withSequence, withTiming, runOnJS,
} from 'react-native-reanimated';
import { useGame } from '../GameContext';

const lightColors = { bg: '#f9fafb', text: '#111827', muted: '#6b7280', card: '#ffffff', border: '#e5e7eb' };
const darkColors  = { bg: '#0d1117', text: '#e6edf3', muted: '#8b949e', card: '#161b22', border: '#30363d' };

const LEGEND = [
  '👆  Tap: +1 point',
  '✌️  Double-tap: +2 points',
  '⏱️  Long-press (3s): +5 points',
  '🔄  Swipe: +1–10 random points',
  '🤏  Pinch: +3 points',
];

export default function GameScreen() {
  const { score, isDark, addScore, markChallenge } = useGame();
  const [feedback, setFeedback] = useState('');
  const feedbackTimer = useRef(null);

 
  const translateX  = useSharedValue(0);
  const translateY  = useSharedValue(0);
  const scale       = useSharedValue(1);
  const savedScale  = useSharedValue(1);
  const flashOpacity = useSharedValue(1);

  const showFeedback = useCallback((msg) => {
    setFeedback(msg);
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setFeedback(''), 900);
  }, []);


  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      runOnJS(addScore)(2);
      runOnJS(markChallenge)('doubletap5', 1);
      runOnJS(showFeedback)('+2 ✌️');
      scale.value = withSequence(withSpring(1.3), withSpring(1));
    });

  const singleTap = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => {
      runOnJS(addScore)(1);
      runOnJS(markChallenge)('tap10', 1);
      runOnJS(showFeedback)('+1');
      flashOpacity.value = withSequence(
        withTiming(0.5, { duration: 60 }),
        withTiming(1,   { duration: 150 })
      );
    });

  const longPress = Gesture.LongPress()
    .minDuration(3000)
    .onEnd((_e, success) => {
      if (success) {
        runOnJS(addScore)(5);
        runOnJS(markChallenge)('longpress', 1);
        runOnJS(showFeedback)('+5 🔥');
        scale.value = withSequence(withSpring(1.6), withSpring(1));
      }
    });

  const pan = Gesture.Pan()
    .onChange(e => {
      translateX.value += e.changeX;
      translateY.value += e.changeY;
    })
    .onEnd(() => {
      runOnJS(markChallenge)('drag', 1);
    });

  const pinch = Gesture.Pinch()
    .onChange(e => {
      scale.value = Math.max(0.5, Math.min(3, savedScale.value * e.scale));
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      runOnJS(addScore)(3);
      runOnJS(markChallenge)('pinch', 1);
      runOnJS(showFeedback)('+3 🤏');
    });

  const flingRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => {
      const pts = Math.floor(Math.random() * 10) + 1;
      runOnJS(addScore)(pts, true);
      runOnJS(markChallenge)('swiperight', 1);
      runOnJS(showFeedback)(`+${pts} 👉`);
    });

  const flingLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => {
      const pts = Math.floor(Math.random() * 10) + 1;
      runOnJS(addScore)(pts, true);
      runOnJS(markChallenge)('swipeleft', 1);
      runOnJS(showFeedback)(`+${pts} 👈`);
    });

  const tapGroup   = Gesture.Exclusive(doubleTap, singleTap);
  const flingGroup = Gesture.Exclusive(flingRight, flingLeft);
  const moveGroup  = Gesture.Simultaneous(pan, pinch);
  const composed   = Gesture.Race(tapGroup, longPress, moveGroup, flingGroup);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: flashOpacity.value,
  }));

  const th = isDark ? darkColors : lightColors;

  return (
    <SafeAreaView style={[s.container, { backgroundColor: th.bg }]}>
      <View style={s.scoreBox}>
        <Text style={[s.scoreLabel, { color: th.muted }]}>SCORE</Text>
        <Text style={[s.scoreNum,   { color: th.text  }]}>{score}</Text>
      </View>

      <Text style={s.feedback}>{feedback}</Text>

      <View style={s.gameArea}>
        <GestureDetector gesture={composed}>
          <Animated.View style={[s.clicker, animStyle]}>
            <Text style={s.clickerIcon}>👆</Text>
            <Text style={s.clickerLabel}>TAP ME</Text>
          </Animated.View>
        </GestureDetector>
      </View>

      <View style={[s.legend, { backgroundColor: th.card, borderColor: th.border }]}>
        {LEGEND.map(item => (
          <Text key={item} style={[s.legendItem, { color: th.text }]}>{item}</Text>
        ))}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, alignItems: 'center' },
  scoreBox:     { alignItems: 'center', paddingTop: 20 },
  scoreLabel:   { fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  scoreNum:     { fontSize: 72, fontWeight: 'bold', lineHeight: 82 },
  feedback:     { height: 30, fontSize: 22, fontWeight: 'bold', color: '#3b82f6', textAlign: 'center' },
  gameArea:     { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' },
  clicker:      {
    width: 130, height: 130, borderRadius: 65,
    backgroundColor: '#3b82f6',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#3b82f6', shadowOpacity: 0.5,
    shadowRadius: 20, elevation: 10,
  },
  clickerIcon:  { fontSize: 36 },
  clickerLabel: { color: '#fff', fontWeight: '700', fontSize: 11, letterSpacing: 1.5, marginTop: 2 },
  legend:       { width: '90%', borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 16, gap: 4 },
  legendItem:   { fontSize: 13, paddingVertical: 1 },
});