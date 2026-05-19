# לוח בקרה ניהולי

פרויקט React מאורגן עם גרפים דו-מימדיים, תלת-מימד (Three.js) ומפת חום לרציפות חודשית.

## מבנה הקבצים

```
dashboard-app/
├── src/
│   ├── data.js              # נתונים וצבעי קטגוריות
│   ├── utils.js             # עזרי חישוב ומפת חום
│   ├── App.jsx              # ממשק ראשי וטאבים
│   ├── main.jsx
│   ├── index.css
│   └── components/
│       ├── Tooltips.jsx
│       ├── BadgeLabel.jsx
│       └── Interactive3DChart.jsx
├── index.html
└── package.json
```

## הרצה

1. התקן [Node.js](https://nodejs.org/) (גרסה 18 ומעלה).
2. בטרמינל:

```bash
cd dashboard-app
npm install
npm run dev
```

3. הדפדפן ייפתח בכתובת `http://localhost:5173`.

## טאבים

- **רציפות תפעולית** – טבלת משימות, מפת חום חודשית וגרף מגמה
- **מטריצת החלטות** – תרשים 2D / 3D אינטראקטיבי
- **פילוח קטגוריות** – גרפי עומס לפי סיווג
