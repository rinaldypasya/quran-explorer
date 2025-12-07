import React, { useState, useEffect, useRef } from 'react';
import './QuranExplorer.css';

const QuranExplorer = () => {
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [surahData, setSurahData] = useState(null);
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verseLoading, setVerseLoading] = useState(false);
  const [currentReciter, setCurrentReciter] = useState('1');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState('home');
  const audioRef = useRef(null);

  // Fetch all surahs on mount
  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        // Correct endpoint: /api/surah.json
        const response = await fetch('https://quranapi.pages.dev/api/surah.json');
        if (!response.ok) {
          throw new Error('Failed to fetch surahs');
        }
        const data = await response.json();
        // Add surahNo to each item (index + 1) since API doesn't include it
        const surahsWithNumbers = data.map((surah, index) => ({
          ...surah,
          surahNo: index + 1
        }));
        setSurahs(surahsWithNumbers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching surahs:', error);
        setLoading(false);
      }
    };
    fetchSurahs();
  }, []);

  // Fetch surah data when selected
  const fetchSurahData = async (surahNo) => {
    setVerseLoading(true);
    try {
      const response = await fetch(`https://quranapi.pages.dev/api/${surahNo}.json`);
      if (!response.ok) {
        throw new Error('Failed to fetch surah');
      }
      const data = await response.json();
      // Map API response to expected format
      const mappedData = {
        ...data,
        surahNo,
        arabic: data.arabic1 || data.arabic2, // Use arabic1 (with diacritics) or fallback to arabic2
        translation: data.english, // Map english to translation
      };
      setSurahData(mappedData);
      setSelectedSurah(surahNo);
      setView('surah');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error fetching surah:', error);
    }
    setVerseLoading(false);
  };

  // Fetch specific verse
  const fetchVerse = async (surahNo, ayahNo) => {
    setVerseLoading(true);
    try {
      const response = await fetch(`https://quranapi.pages.dev/api/${surahNo}/${ayahNo}.json`);
      const data = await response.json();
      // Map API response to expected format
      const mappedData = {
        ...data,
        arabic: data.arabic1 || data.arabic2,
        translation: data.english,
      };
      setSelectedVerse(mappedData);
      setView('verse');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error fetching verse:', error);
    }
    setVerseLoading(false);
  };

  // Play audio
  const playAudio = (audioUrl) => {
    if (audioRef.current) {
      if (audioRef.current.src === audioUrl && isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setIsPlaying(true);
        setCurrentAudioUrl(audioUrl);
      }
    }
  };

  // Filter surahs based on search
  const filteredSurahs = surahs.filter(surah =>
    surah.surahName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.surahNameArabic?.includes(searchQuery) ||
    surah.surahNo?.toString().includes(searchQuery)
  );

  // Reciters available
  const reciters = [
    { id: '1', name: 'Mishary Rashid Al Afasy' },
    { id: '2', name: 'Abu Bakr Al Shatri' },
    { id: '3', name: 'Nasser Al Qatami' },
    { id: '4', name: 'Yasser Al Dosari' },
  ];

  // Get bismillah based on surah
  const getBismillah = (surahNo) => {
    if (surahNo === 1 || surahNo === 9) return null;
    return 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';
  };

  const goHome = () => {
    setView('home');
    setSelectedSurah(null);
    setSelectedVerse(null);
    setSurahData(null);
  };

  const goBackToSurah = () => {
    setView('surah');
    setSelectedVerse(null);
  };

  return (
    <div className="quran-explorer">
      {/* Background Decorations */}
      <div className="background-decorations">
        <div className="decoration-circle decoration-1"></div>
        <div className="decoration-circle decoration-2"></div>
        <div className="decoration-ring decoration-3"></div>
        <div className="decoration-ring decoration-4"></div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentAudioUrl('');
        }}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <button onClick={goHome} className="logo-button">
            <div className="logo-icon">
              <span>ق</span>
            </div>
            <div className="logo-text">
              <h1>Quran Explorer</h1>
              <p>القرآن الكريم</p>
            </div>
          </button>

          <nav className="nav-buttons">
            {view !== 'home' && (
              <button onClick={goHome} className="nav-button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </button>
            )}
            {view === 'verse' && selectedSurah && (
              <button onClick={goBackToSurah} className="nav-button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 19l-7-7 7-7" />
                </svg>
                Back to Surah
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        
        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <span className="loading-icon">📖</span>
            </div>
            <p>Loading the Holy Quran...</p>
          </div>
        )}

        {/* Home View */}
        {!loading && view === 'home' && (
          <div className="home-view animate-fadeIn">
            {/* Hero Section */}
            <div className="hero-section">
              <h2 className="hero-title">The Noble Quran</h2>
              <p className="hero-subtitle">Explore the divine words with beautiful recitations and translations</p>
              
              {/* Search Bar */}
              <div className="search-container">
                <div className="search-wrapper">
                  <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search surahs by name or number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="stats-grid">
              {[
                { label: 'Surahs', value: '114', icon: '📜' },
                { label: 'Verses', value: '6,236', icon: '✨' },
                { label: 'Juz', value: '30', icon: '📖' },
                { label: 'Reciters', value: '4+', icon: '🎧' },
              ].map((stat, i) => (
                <div key={stat.label} className="stat-card" style={{ animationDelay: `${i * 100}ms` }}>
                  <span className="stat-icon">{stat.icon}</span>
                  <p className="stat-value">{stat.value}</p>
                  <p className="stat-label">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Surah Grid */}
            <div className="surah-grid">
              {filteredSurahs.map((surah, index) => (
                <button
                  key={surah.surahNo}
                  onClick={() => fetchSurahData(surah.surahNo)}
                  className="surah-card"
                  style={{ animationDelay: `${index * 20}ms` }}
                >
                  <div className="surah-card-content">
                    <div className="surah-info">
                      <div className="surah-number">
                        <span>{surah.surahNo}</span>
                      </div>
                      <div className="surah-details">
                        <h3>{surah.surahName}</h3>
                        <p>{surah.totalAyah} verses • {surah.revelationPlace}</p>
                      </div>
                    </div>
                    <span className="surah-arabic">{surah.surahNameArabic}</span>
                  </div>
                </button>
              ))}
            </div>

            {filteredSurahs.length === 0 && (
              <div className="no-results">
                <p>No surahs found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}

        {/* Surah View */}
        {!loading && view === 'surah' && surahData && (
          <div className="surah-view animate-fadeIn">
            {/* Surah Header */}
            <div className="surah-header">
              <div className="surah-badge">
                <span>Surah {surahData.surahNo}</span>
                <span>•</span>
                <span>{surahData.totalAyah} Verses</span>
                <span>•</span>
                <span>{surahData.revelationPlace}</span>
              </div>
              
              <h2 className="surah-title">{surahData.surahName}</h2>
              <p className="surah-title-arabic">{surahData.surahNameArabicLong}</p>
              <p className="surah-translation">{surahData.surahNameTranslation}</p>

              {/* Reciter Selection */}
              <div className="reciter-selection">
                <span className="reciter-label">Reciter:</span>
                <div className="reciter-buttons">
                  {reciters.map(reciter => (
                    <button
                      key={reciter.id}
                      onClick={() => setCurrentReciter(reciter.id)}
                      className={`reciter-button ${currentReciter === reciter.id ? 'active' : ''}`}
                    >
                      {reciter.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Play Full Surah */}
              {surahData.audio && surahData.audio[currentReciter] && (
                <button
                  onClick={() => playAudio(surahData.audio[currentReciter].url)}
                  className="play-surah-button"
                >
                  {isPlaying && currentAudioUrl === surahData.audio[currentReciter].url ? (
                    <>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                      Pause Full Surah
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Play Full Surah
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Bismillah */}
            {getBismillah(surahData.surahNo) && (
              <div className="bismillah">
                <p className="bismillah-arabic">{getBismillah(surahData.surahNo)}</p>
                <p className="bismillah-translation">In the name of Allah, the Most Gracious, the Most Merciful</p>
              </div>
            )}

            {/* Verses */}
            <div className="verses-container">
              {surahData.arabic?.map((arabicText, index) => {
                const ayahNo = index + 1;
                // Generate verse audio URL based on the pattern from individual verse endpoint
                const verseAudioUrl = `https://the-quran-project.github.io/Quran-Audio/Data/${currentReciter}/${surahData.surahNo}_${ayahNo}.mp3`;

                return (
                  <div
                    key={index}
                    onClick={() => fetchVerse(surahData.surahNo, ayahNo)}
                    className="verse-card"
                  >
                    <div className="verse-content">
                      <div className="verse-number">
                        <span>{ayahNo}</span>
                      </div>
                      <div className="verse-text">
                        <p className="verse-arabic" dir="rtl">
                          {arabicText} ۝
                        </p>
                        {surahData.translation && surahData.translation[index] && (
                          <p className="verse-translation">
                            {surahData.translation[index]}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Verse Actions */}
                    <div className="verse-actions">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playAudio(verseAudioUrl);
                        }}
                        className="verse-action-button play"
                      >
                        {isPlaying && currentAudioUrl === verseAudioUrl ? (
                          <>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                            Pause
                          </>
                        ) : (
                          <>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                            Play
                          </>
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          fetchVerse(surahData.surahNo, ayahNo);
                        }}
                        className="verse-action-button details"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Single Verse View */}
        {!loading && view === 'verse' && selectedVerse && (
          <div className="verse-view animate-fadeIn">
            <div className="verse-view-header">
              <div className="verse-view-badge">
                <span>{selectedVerse.surahName}</span>
                <span>•</span>
                <span>Verse {selectedVerse.ayahNo}</span>
              </div>
            </div>

            {/* Main Verse Card */}
            <div className="verse-view-card">
              <p className="verse-view-arabic" dir="rtl">
                {selectedVerse.arabic} ۝
              </p>
              
              <div className="verse-view-divider"></div>
              
              <p className="verse-view-translation">
                {selectedVerse.translation}
              </p>

              {/* Audio Controls */}
              <div className="verse-view-audio">
                <span className="audio-label">Listen:</span>
                <div className="audio-buttons">
                  {selectedVerse.audio && Object.entries(selectedVerse.audio).slice(0, 4).map(([id, audio]) => {
                    const isThisAudioPlaying = isPlaying && currentAudioUrl === audio.url;
                    return (
                      <button
                        key={id}
                        onClick={() => playAudio(audio.url)}
                        className={`audio-button ${isThisAudioPlaying ? 'playing' : ''}`}
                        style={isThisAudioPlaying ? { background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' } : {}}
                      >
                        {isThisAudioPlaying ? '⏸ ' : '▶ '}
                        {audio.reciter?.split(' ').slice(-2).join(' ')}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Verse Info */}
            <div className="verse-info-grid">
              {[
                { label: 'Surah', value: selectedVerse.surahName },
                { label: 'Verse', value: selectedVerse.ayahNo },
                { label: 'Total Verses', value: selectedVerse.totalAyah },
                { label: 'Revelation', value: selectedVerse.revelationPlace },
              ].map(item => (
                <div key={item.label} className="verse-info-card">
                  <p className="verse-info-label">{item.label}</p>
                  <p className="verse-info-value">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {verseLoading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>
          Built with ❤️ using{' '}
          <a href="https://quranapi.pages.dev" target="_blank" rel="noopener noreferrer">
            Quran API
          </a>
          {' '}• Quran.Foundation
        </p>
      </footer>
    </div>
  );
};

export default QuranExplorer;