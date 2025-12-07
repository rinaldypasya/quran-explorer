# Quran Explorer 📖

A beautiful Quran reading application built with React, using the Quran.Foundation API.

![Quran Explorer](https://img.shields.io/badge/Quran-Explorer-10b981?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2.0-61dafb?style=for-the-badge&logo=react)
![API](https://img.shields.io/badge/API-Quran.Foundation-fbbf24?style=for-the-badge)

## ✨ Features

- 📜 **Browse All 114 Surahs** - Beautiful grid with Arabic names, English translations, and verse counts
- 🔍 **Search Functionality** - Filter surahs by name (English/Arabic) or number
- 📖 **Read Full Surahs** - Arabic text with English translations
- 🔎 **Individual Verse View** - Detailed view with verse information
- 🎧 **Audio Recitation** - 4 renowned reciters:
  - Mishary Rashid Al Afasy
  - Abu Bakr Al Shatri
  - Nasser Al Qatami
  - Yasser Al Dosari
- ▶️ **Play per Verse or Full Surah** - Listen to individual verses or complete chapters
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Extract the zip file** to your desired location

2. **Navigate to the project directory**:
   ```bash
   cd quran-explorer-app
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```
   or if you use yarn:
   ```bash
   yarn install
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```
   or:
   ```bash
   yarn start
   ```

5. **Open your browser** and visit:
   ```
   http://localhost:3000
   ```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Runs the app in development mode |
| `npm run build` | Builds the app for production |
| `npm test` | Runs the test suite |
| `npm run eject` | Ejects from Create React App |

## 📁 Project Structure

```
quran-explorer-app/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── QuranExplorer.js
│   │   └── QuranExplorer.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## 🔌 API Integration

This app uses the free [Quran API](https://quranapi.pages.dev) from Quran.Foundation:

| Endpoint | Description |
|----------|-------------|
| `GET /api/chapters.json` | List all 114 surahs |
| `GET /api/{surahNo}.json` | Get full surah with verses |
| `GET /api/{surahNo}/{ayahNo}.json` | Get specific verse details |

The API is free, requires no authentication, and has no rate limits.

## 🎨 Design Features

- **Luxurious dark theme** with emerald and amber accents
- **Beautiful Arabic typography** using the Amiri font
- **Subtle animations** and hover effects
- **Gradient backgrounds** with decorative blur elements
- **Glass-morphism effects** with backdrop blur
- **Responsive layout** for all screen sizes

## 📄 License

This project is open source and available for personal and educational use.

## 🙏 Credits

- **Quran API**: [quranapi.pages.dev](https://quranapi.pages.dev)
- **Quran.Foundation**: For providing free access to Quran data
- **Font**: [Amiri](https://fonts.google.com/specimen/Amiri) for Arabic text

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ for the Muslim community
