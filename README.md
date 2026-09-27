# שש-בש אונליין

משחק שש-בש לשני שחקנים בזמן אמת. שחקן אחד פותח חדר ומקבל קוד, השני נכנס עם הקוד, ומשחקים.
אין הרשמה ואין DB. הכל נשמר בזיכרון של השרת, וניתוק או רענון סוגרים את החדר.

## טכנולוגיות

**שרת (`backend`)**

- Node.js
- Socket.IO
- `node:test` לבדיקות

**לקוח (`frontend`)**

- React + TypeScript (Vite)
- Socket.IO Client
- Zustand
- React Router

## איך מריצים

### שרת

```bash
cd backend
npm install
```

יוצרים קובץ `.env` לפי `example.env`:

```
PORT=3000
```

ומריצים:

```bash
npm start
```

השרת עולה על `http://localhost:3000`.

### לקוח

```bash
cd frontend
npm install
npm run dev
```

הלקוח עולה על `http://localhost:5173` ומתחבר לשרת ב-`http://localhost:3000`.

### בדיקות

```bash
cd backend
npm test
```

## הבדיקות שעשיתי

### מסעיף הבדיקות במפרט

| בדיקה מהמפרט                                      | הבדיקה אצלי                                                             |
| ------------------------------------------------- | ----------------------------------------------------------------------- |
| מצב פתיחה נכון לשני הצבעים, ו-15 כלים לכל צבע     | `board.test.js`: 15 כלים לכל צבע, מיקום הלבנים ומיקום השחורים לפי הטבלה |
| אי אפשר לנוע לנקודה חסומה                         | `move.test.js`: מהלך לנקודה עם שני כלים של היריב נדחה                   |
| אכילה של כלי יחיד מעבירה אותו לבר                 | `move.test.js`: כלי יחיד של היריב עובר לבר                              |
| כלי על הבר מחייב כניסה לפני מהלך רגיל             | `move.test.js`: מהלך רגיל נדחה כשיש כלי על הבר, וכניסה מהבר עובדת       |
| דאבל                                              | `turn.test.js`: בדאבל מקבלים ארבע קוביות                                |
| התור עובר אוטומטית כשאין מהלך, גם אחרי הטלה חסומה | `turn.test.js`: כל נקודות הכניסה חסומות, והתור עובר ליריב               |

### בנוסף

- **הגרלת פותח:** השחור פותח כשהוא גבוה יותר, ובתיקו מטילים שוב.
- **הטלה:** אי אפשר להטיל באמצע תור.
- **לוח חדש לכל משחק:** שני משחקים לא חולקים את אותו לוח.
- **חדרים:** יצירה, שם לא תקין, socket שכבר בחדר, הצטרפות עם קוד באותיות קטנות, חדר לא קיים, חדר מלא, עזיבה, קוד חדר שמוגרל מחדש אם הוא תפוס, ושהמידע שנשלח ללקוח לא כולל `socket.id`.
- **שמירת חדרים:** שמירה, קריאה, מחיקה, ומיפוי מ-socket לחדר.

## מבנה תיקיות

```
backgammon/
├── backend/
│   ├── example.env
│   ├── package.json
│   └── src/
│       ├── app.js                  # יצירת השרת וחיבור ה-handlers
│       ├── config.js               # קבועים: צבעים, סטטוסים, פורט
│       ├── engine/                 # חוקי השש-בש, בלי Socket
│       │   ├── board.js            # מצב פתיחה וספירת כלים
│       │   ├── move.js             # בדיקת מהלך, מהלכים חוקיים, ביצוע, סיום תור
│       │   └── turn.js             # הגרלת פותח והטלת קוביות
│       ├── rooms/                  # חוקי החדר
│       │   ├── room.store.js       # החדרים בזיכרון (Map)
│       │   ├── room.service.js     # יצירה, הצטרפות, עזיבה
│       │   └── game.service.js     # התחלה, הטלה, מהלך, משחק חוזר
│       ├── socket/                 # מקבל אירועים מהלקוח ועונה
│       │   ├── room.handler.js
│       │   └── game.handlers.js
│       ├── utils/
│       │   ├── helper.js
│       │   ├── move.js
│       │   └── socket.js           # safe, broadcastRoom
│       └── tests/
│           ├── helpers.js          # stateWith, fixedRolls
│           ├── engine/
│           │   ├── board.test.js
│           │   ├── move.test.js
│           │   └── turn.test.js
│           └── rooms/
│               ├── room.service.test.js
│               └── room.store.test.js
│
└── frontend/
    ├── package.json
    └── src/
        ├── App.tsx                 # נתיבים, ומאזינים לשרת פעם אחת
        ├── types.ts                # כל הטיפוסים של החוזה מול השרת
        ├── socket/
        │   ├── socket.ts           # חיבור אחד לשרת
        │   └── actions.ts          # פונקציה לכל אירוע ששולחים
        ├── store/
        │   └── useGameStore.ts     # החדר, המשחק והצבע שלי
        ├── hooks/
        │   └── useSocketEvents.ts  # מקשיב לכל מה שהשרת משדר
        ├── routes/
        │   └── RoomGuard.tsx       # מעביר לדף הנכון לפי מצב החדר
        ├── pages/
        │   ├── LobbyPage.tsx
        │   ├── WaitingRoomPage.tsx
        │   └── GamePage.tsx
        └── components/
            ├── GameHeader.tsx
            ├── DiceArea.tsx
            ├── Board.tsx
            ├── BoardPoint.tsx
            └── FinishPanel.tsx
```

---

## (הערה: בקשר לעיצוב)

לא הספקתי לעצב את הלוח, לקחתי עיצוב בסיסי מ- AI
