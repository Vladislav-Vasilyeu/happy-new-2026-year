import { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import Snowfall from 'react-snowfall';
import background from './assets/happy_new_year.png';
import './App.css';

function App() {
  const [timeLeft, setTimeLeft] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [activeTab, setActiveTab] = useState('timer');
  const [wish, setWish] = useState('');
  const [wishes, setWishes] = useState([]);
  const audioRef = useRef(null);

  // === ТАЙМЕР ===
  const calculateTimeLeft = () => {
    const now = new Date();
    const nextYear = now.getFullYear() + 1;
    const newYear = new Date(`January 1, ${nextYear} 00:00:00`);
    const diff = newYear - now;

    if (diff <= 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 10000);
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  // === МУЗЫКА ===
  useEffect(() => {
    if (audioRef.current) {
      isMusicOn ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [isMusicOn]);

  // === ЖЕЛАНИЯ ===
  useEffect(() => {
    const saved = localStorage.getItem('newYearWishes');
    if (saved) setWishes(JSON.parse(saved));
  }, []);

  const sendWish = () => {
    if (!wish.trim()) return;
    const newWish = { text: wish, id: Date.now(), x: Math.random() * 80 + 10, y: Math.random() * 60 + 20 };
    const updated = [...wishes, newWish];
    setWishes(updated);
    localStorage.setItem('newYearWishes', JSON.stringify(updated));
    setWish('');
  };

  const format = (n) => (n < 10 ? `0${n}` : n);

  return (
    <>
      {/* КОНФЕТТИ */}
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={500} />}

      {/* МУЗЫКА */}
      <audio ref={audioRef} loop>
  <source src="/src/assets/Jingle-Bells-3(chosic.com).mp3" type="audio/mp3" />
  {/* Fallback: Твой браузер не поддерживает аудио */}
</audio>

      {/* СНЕГ */}
      <Snowfall snowflakeCount={250} speed={[0.5, 2]} wind={[-0.5, 1]} />

      <div className="app">
        {/* ВКЛАДКИ */}
        <div className="tabs">
          <button className={activeTab === 'timer' ? 'active' : ''} onClick={() => setActiveTab('timer')}>
            До НГ
          </button>
          <button className={activeTab === 'wish' ? 'active' : ''} onClick={() => setActiveTab('wish')}>
            Загадать желание
          </button>
        </div>

        {/* КНОПКА МУЗЫКИ */}
        <button className="music-btn" onClick={() => setIsMusicOn(!isMusicOn)}>
          {isMusicOn ? '🔇' : '🎵'}
        </button>

        {/* ТАЙМЕР */}
        {activeTab === 'timer' && (
          <div className="container">
            <h1 className="title">До Нового Года</h1>
            <div className="countdown">
              {['days', 'hours', 'minutes', 'seconds'].map((unit, i) => (
                <div key={unit} className="time-item">
                  <div className="time-value">{format(timeLeft[unit] ?? 0)}</div>
                  <div className="time-label">
                    {unit === 'days' ? 'дней' : unit === 'hours' ? 'часов' : unit === 'minutes' ? 'минут' : 'секунд'}
                  </div>
                  
                </div>
              ))}
            </div>
            <div className="sparkles">
              <span>✨</span><span>🎄</span><span>🎁</span><span>🥂</span><span>🎅</span>
            </div>
          </div>
        )}

        {/* ЖЕЛАНИЯ */}
        {activeTab === 'wish' && (
          <div className="wish-container">
            <h2 className="wish-title">Загадать желание</h2>
            <textarea
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              placeholder="Напиши своё желание..."
              className="wish-input"
              maxLength="150"
            />
            <button onClick={sendWish} className="wish-btn">Отправить в космос!</button>

            {/* ЛЕТЯЩИЕ ЖЕЛАНИЯ */}
            {wishes.map((w) => (
              <div
                key={w.id}
                className="flying-wish"
                style={{ '--x': `${w.x}vw`, '--y': `${w.y}vh` }}
              >
                {w.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default App;