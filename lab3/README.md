#Clicker — Лабораторна робота №3

## Інструкція запуску

### Через Expo Snack (онлайн)
1. Відкрити https://snack.expo.dev
2. Завантажити або вставити файли проєкту:
   - App.js, GameContext.js — в корінь проєкту
   - screens/GameScreen.js, screens/ChallengesScreen.js, screens/SettingsScreen.js — у папку screens/
3. Натиснути Save, потім запустити на вкладці Web, Android або iOS


### Залежності (package.json)
{
  "dependencies": {
    "react-native-gesture-handler": "~2.28.0",
    "react-native-reanimated": "~4.1.1",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0"
  }
}


## Опис реалізованого функціоналу

### Навігація
Реалізовано Bottom Tab Navigator з трьома вкладками: Гра, Завдання, Налаштування.
Навігація адаптується до темного та світлого режиму.

### Головний екран — GameScreen
Відображає лічильник очок та інтерактивний об'єкт, який реагує на 6 типів жестів:

| Жест | Обробник (RNGH v2) | Результат |
|------|--------------------|-----------|
| Одиночний тап | Gesture.Tap() — numberOfTaps: 1 | +1 очко |
| Подвійний тап | Gesture.Tap() — numberOfTaps: 2 | +2 очки |
| Довге утримання (3 сек) | Gesture.LongPress() — minDuration: 3000 | +5 очків |
| Перетягування | Gesture.Pan() | Переміщення об'єкта по екрану |
| Свайп вправо | Gesture.Fling() — direction: RIGHT | +1–10 очків (випадково) |
| Свайп вліво | Gesture.Fling() — direction: LEFT | +1–10 очків (випадково) |
| Масштабування | Gesture.Pinch() | +3 очки, зміна розміру об'єкта |

Жести скомпоновані через GestureDetector:
- Gesture.Exclusive(doubleTap, singleTap) — пріоритет подвійного тапу
- Gesture.Simultaneous(pan, pinch) — одночасне переміщення і масштабування
- Gesture.Race(...) — перший активований жест виграє

### Екран завдань — ChallengesScreen
Відображає список із 9 завдань з прогрес-барами та статусом виконання:

1. Зроби 10 кліків (Tap x10)
2. Подвійний клік 5 разів (DoubleTap x5)
3. Утримай об'єкт 3 секунди (LongPress)
4. Перетягни об'єкт (Pan)
5. Свайп вправо (Fling RIGHT)
6. Свайп вліво (Fling LEFT)
7. Зміни розмір об'єкта (Pinch)
8. Набери 100 очок (Score >= 100)
9. Набери 50 очок свайпами (власне завдання)

### Екран налаштувань — SettingsScreen
- Статистика: загальні очки, кількість виконаних завдань, відсоток прогресу
- Перемикач темної/світлої теми
- Список усіх завдань зі статусом виконання
- Кнопка скидання прогресу (з діалогом підтвердження)

### Управління станом
Реалізовано через React Context API (GameContext):
- Зберігає очки, прогрес завдань, поточну тему
- Автоматично відстежує прогрес завдань score-based через useEffect
- Функції: addScore, markChallenge, toggleTheme, resetGame

### Стилізація
- StyleSheet.create з підтримкою темної та світлої теми
- Анімації об'єкта через react-native-reanimated (scale, translate, opacity)

## Скріншоти

<img width="505" height="843" alt="1 (4)" src="https://github.com/user-attachments/assets/d8e61ded-8c8e-4178-a90c-aebcc968cc01" />
<img width="523" height="851" alt="1 (3)" src="https://github.com/user-attachments/assets/801ae937-ae45-4111-b8ad-62d7042d9128" />
<img width="425" height="855" alt="1 (2)" src="https://github.com/user-attachments/assets/dcdab6e6-638d-4b47-ab96-5abd267e3db1" />
<img width="455" height="838" alt="1 (1)" src="https://github.com/user-attachments/assets/0045ea10-5d22-4f21-8ae9-c4ccddf888bf" />
<img width="467" height="847" alt="1 (5)" src="https://github.com/user-attachments/assets/93053fbc-f089-485c-bf4e-2dc5b56ebcb2" />




## Висновки

У ході виконання лабораторної роботи №3 було розроблено мобільний застосунок — гру-клікер з використанням жестових взаємодій на базі бібліотеки react-native-gesture-handler (версія 2, API GestureDetector).

Реалізовано 6 типів жестів: одиночний та подвійний тап, довге натискання, перетягування , свайп та масштабування. Жести коректно скомпоновані за допомогою Gesture.Exclusive, Gesture.Simultaneous та Gesture.Race для уникнення конфліктів між ними.
Для управління станом застосовано React Context API, що дозволило централізовано зберігати очки, прогрес завдань та стан теми без зайвого передавання props. Завдання відстежуються автоматично — кількісні через useEffect, подійні через функцію markChallenge.

