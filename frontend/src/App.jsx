import { useState } from 'react'
import MagicRings from './MagicRings'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import './wallet.css'
import './form.css'
import './prediction.css'
import './ticket.css'


const LEAGUES = [
  { code: 'GB1', name: 'Premier Leauge' },
  { code: 'IT1', name: 'Serie A' },
  { code: "L1", name: "Bundesliga (Tyskland)" },
  { code: "FR1", name: "Ligue 1 (Frankrike)" },
  { code: "NL1", name: "Eredivisie (Nederländerna)" },
  { code: "SC1", name: "Scottish Premiership (Skottland)" },
  { code: "MLS1", name: "MLS (USA)" },
  { code: "PL1", name: "Ekstraklasa (Polen)" }
];

const position = [
  'Attack (ST/CF)',
  'Midfielder (CM/CAM/CDM)',
  'Defender (CB/LB/RB)',
  'Goalkeeper (GK)'
];

function App() {
  const [count, setCount] = useState(0);
  const [isEvaluated, setIsEvaluted] = useState(false);
  const [predictedValue, setPredictedValue] = useState(null);
  const [showOtherValuations, setShowOtherValuations] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [loadingPredictions, setLoadingPredictions] = useState(false);
  const [predictionError, setPredictionError] = useState('');

  const handleGetValuation = async (e) => {
    if (e) e.preventDefault();

    const form = e.currentTarget.tagName === 'FORM' ? e.currentTarget : e.currentTarget.closest('form');
    const formData = new FormData(form);

    const playerData = {
      player_name: formData.get("player_name").trim(),
      goals: Number(formData.get("goals")),
      assists: Number(formData.get("assists")),
      league: formData.get("league"),
      position: formData.get("position"),
      minutes_played: Number(formData.get("minutes_played")),
      age: Number(formData.get("age")),
    };

    try {
      const response = await fetch("http://localhost:8000/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playerData),
      });

      if (!response.ok) {
        throw new Error("Kunde inte hämta värdering");
      }

      const data = await response.json();
      console.log("Predicted value:", data.predicted_value);
      setPredictedValue(data.predicted_value);
      setIsEvaluted(true);
    } catch (error) {
      console.error(error);
    }
  };
  const handleShowValuations = async (e) => {
    e.preventDefault();

    setLoadingPredictions(true);
    setPredictionError('');
    setShowOtherValuations(true);

    try {
      const response = await fetch("http://localhost:8000/api/predictions");

      if (!response.ok) {
        throw new Error("Kunde inte hämta tidigare valuations");
      }

      const data = await response.json();
      setPredictions(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error(error);
      setPredictionError("Kunde inte hämta spelarvärderingar.");
    } finally {
      setLoadingPredictions(false);
    }
  };

  const handleReset = () => {
    setIsEvaluted(false);
  };

  return (
    <>
      <span className="badge">ML PLAYER VALUATION ENGINE</span>
      <h1
        className="sliced-title"
        style={{ '--text': "'FOOTBALL VALUATION'" }}
      >
        <span>Football</span> Valuation
      </h1>
      {showOtherValuations ? (
        <div className="ticket-page">

          <button
            className="ticket-back"
            onClick={() => setShowOtherValuations(false)}
          >
            ← Back
          </button>

          {loadingPredictions ? (
            <p className="ticket-status">Hämtar spelarvärderingar...</p>
          ) : predictionError ? (
            <p className="ticket-status">{predictionError}</p>
          ) : predictions.length === 0 ? (
            <p className="ticket-status">Inga sparade spelarvärderingar hittades.</p>
          ) : (
            predictions.map((player, index) => (
              <div className="player-card" key={`${player.player_name}-${index}`}>
                <div className="player-card__glow" />
                <div className="player-card__rarity">PLAYER VALUATION</div>

                <div className="player-card__header">
                  <span className="player-card__eyebrow">AI SCOUT REPORT</span>
                  <span className="player-card__index">#{String(index + 1).padStart(2, '0')}</span>
                </div>

                <div className="player-card__art">
                  <span className="player-card__initials">
                    {(player.player_name || '??').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                  </span>
                  <span className="player-card__position">{player.position || 'Unknown position'}</span>
                </div>

                <div className="player-card__name-block">
                  <h2>{player.player_name || 'Unknown player'}</h2>
                  <p>{player.league || 'Unknown league'}</p>
                </div>

                <section className="player-card__stats">
                  <div><span>AGE</span><strong>{player.age ?? '-'}</strong></div>
                  <div><span>GOALS</span><strong>{player.goals ?? 0}</strong></div>
                  <div><span>ASSISTS</span><strong>{player.assists ?? 0}</strong></div>
                </section>

                <section className="player-card__details">
                  <div><span>POSITION</span><strong>{player.position || '-'}</strong></div>
                  <div><span>MINUTES PLAYED</span><strong>{player.minutes_played ?? 0}</strong></div>
                </section>

                <div className="player-card__value">
                  <span>ESTIMATED MARKET VALUE</span>
                  <strong>€{Number(player.predicted_value || 0).toLocaleString('sv-SE')}</strong>
                </div>

                <div className="player-card__footer">VALUATION: VERIFIED DATA</div>
              </div>
            ))
          )}
        </div>
      ) : !isEvaluated ? (

        <>
          <div className="hero-row">
          <div className="login-box">
            <p>Valuation</p>
            <form onSubmit={handleGetValuation}>
              <div className="user-box">
                <input required="" name="player_name" type="text" />
                <label>Player name</label>
              </div>
              <div className="user-box">
                <input required="" name="goals" type="number" />
                <label>Goals</label>
              </div>
              <div className="user-box">
                <input required="" name="assists" type="number" />
                <label>Assists</label>
              </div>

              <div className="user-box">
                <select required="" name="league" defaultValue="">
                  <option value=""></option>
                  <option value="GB1">Premier Leauge (England)</option>
                  <option value="IT1">Serie A (Italien)</option>
                  <option value="L1">Bundesliga (Tyskland)</option>
                  <option value="FR1">Ligue 1 (Frankrike)</option>
                  <option value="NL1">Eredivisie (Nederländerna)</option>
                  <option value="SC1">Scottish Premiership (Skottland)</option>
                  <option value="MLS1">MLS (USA)</option>
                  <option value="PL1">Ekstraklasa (Polen)</option>
                  <option value="SER1">SuperLiga (Serbien)</option>
                </select>
                <label>League</label>
              </div>

              <div className="user-box">
                <select required="" name="position" defaultValue="">
                  <option value=""></option>
                  <option value="Attack">Attack</option>
                  <option value="Midfield">Midfield</option>
                  <option value="Defender">Defender</option>
                  <option value="Goalkeeper">Goalkeeper</option>
                </select>
                <label>Position</label>
              </div>
              <div className="user-box">
                <input required="" name="minutes_played" type="number" />
                <label>Minutes played</label>
              </div>
              <div className="user-box">
                <input required="" name="age" type="number" />
                <label>Age</label>
              </div>
              <a href="#" onClick={(e) => { e.preventDefault(); e.currentTarget.closest('form').requestSubmit(); }}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                Get Valuation
              </a>
            </form>
            <p>
              See other{" "}
              <a
                href="#"
                className="a2"
                onClick={(e) => {
                  handleShowValuations(e);
                }}
              >
                Valuations
              </a>
            </p>
          </div>

          <div className="app-container">
            <div className="wallet">
              <div className="wallet-back"></div>

              <div className="card stripe">
                <div className="card-inner">
                  <div className="card-top">
                    <span>Osby BK</span>
                    <div className="chip"></div>
                  </div>
                  <div className="card-bottom">
                    <div className="card-info">
                      <span className="label">Player Name</span>
                      <span className="value">Calle Pålsson</span>
                    </div>
                    <div className="card-number-wrapper">
                      <span className="hidden-stars">**** 4242</span>
                      <span className="card-number">$500 000</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card wise">
                <div className="card-inner">
                  <div className="card-top">
                    <span>Barcelona</span>
                    <div className="chip"></div>
                  </div>
                  <div className="card-bottom">
                    <div className="card-info">
                      <span className="label">Player Name</span>
                      <span className="value">Lamine Yamal</span>
                    </div>
                    <div className="card-number-wrapper">
                      <span className="hidden-stars">**** 8810</span>
                      <span className="card-number">$200 000 000</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card paypal">
                <div className="card-inner">
                  <div className="card-top">
                    <span>Paris Saint<b style={{ color: '#0079C1' }}> Germain</b></span>
                    <div className="chip"></div>
                  </div>
                  <div className="card-bottom">
                    <div className="card-info">
                      <span className="label">Player Name</span>
                      <span className="value">Kylian Mbappe</span>
                    </div>
                    <div className="card-number-wrapper">
                      <span className="hidden-stars">**** 0094</span>
                      <span className="card-number">$120 000 000</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pocket">
                <svg className="pocket-svg" viewBox="0 0 280 160" fill="none">
                  <path
                    d="M 0 20 C 0 10, 5 10, 10 10 C 20 10, 25 25, 40 25 L 240 25 C 255 25, 260 10, 270 10 C 275 10, 280 10, 280 20 L 280 120 C 280 155, 260 160, 240 160 L 40 160 C 20 160, 0 155, 0 120 Z"
                    fill="#1e341e"
                  />
                  <path
                    d="M 8 22 C 8 16, 12 16, 15 16 C 23 16, 27 29, 40 29 L 240 29 C 253 29, 257 16, 265 16 C 268 16, 272 16, 272 22 L 272 120 C 272 150, 255 152, 240 152 L 40 152 C 25 152, 8 152, 8 120 Z"
                    stroke="#3d5635"
                    strokeWidth="1.5"
                    strokeDasharray="6 4"
                  />
                </svg>
                <div className="pocket-content">
                  <div style={{ position: 'relative', height: '24px', width: '100%' }}>
                    <div className="balance-stars">******</div>
                    <div className="balance-real">$12,450.00</div>
                  </div>
                  <div style={{ color: '#698263', fontSize: '12px', fontWeight: 500 }}>
                    Average Market Value
                  </div>
                  <div className="eye-icon-wrapper">
                    <svg
                      className="eye-icon eye-slash"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                      <line x1="3" y1="3" x2="21" y2="21" />
                    </svg>
                    <svg
                      className="eye-icon eye-open"
                      style={{ opacity: 0 }}
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                      <line x1="3" y1="3" x2="21" y2="21" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </>
      ) : (
        <div className="price-card">
          <div className="price-card-glow"></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="price-card-header">
              <div className="price-card-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m12 7 4 3-1.5 5h-5L8 10z" />
                  <path d="M12 2v5" />
                  <path d="m16 10 5-1.5" />
                  <path d="m14.5 15 3.5 4" />
                  <path d="m9.5 15-3.5 4" />
                  <path d="m8 10-5-1.5" />
                </svg>
              </div>
              <div>
                <p className="price-card-title">Price Prediction</p>
              </div>
            </div>

            <div className="price-card-worth">
              <p className="price-card-label">Estimated Worth</p>
              <p className="price-card-val">
                {predictedValue !== null
                  ? `€${Math.round(predictedValue).toLocaleString()}`
                  : "$120,818"}
              </p>
            </div>

            <div className="price-card-graph">
              <svg viewBox="0 0 300 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="aurora-gradient-v2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a3e635" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#a3e635" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,65 C50,20 80,80 150,70 S250,50 300,85"
                  fill="none"
                  stroke="#a3e635"
                  strokeWidth="2"
                />
                <path
                  d="M0,100 L0,65 C50,20 80,80 150,70 S250,50 300,85 L300,100 Z"
                  fill="url(#aurora-gradient-v2)"
                />
              </svg>
              <div className="price-card-dot"></div>
            </div>

            <div className="price-card-footer">
              <button className="price-card-btn" onClick={handleReset}>
                New Valuation
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <MagicRings
          color="#4d5b44"
          colorTwo="#cbf163"
          ringCount={6}
          speed={1}
          attenuation={10}
          lineThickness={2}
          baseRadius={0.35}
          radiusStep={0.1}
          scaleRate={0.1}
          opacity={1}
          blur={0}
          noiseAmount={0.1}
          rotation={0}
          ringGap={1.5}
          fadeIn={0.7}
          fadeOut={0.5}
          followMouse={false}
          mouseInfluence={0}
          hoverScale={1}
          parallax={0}
          clickBurst={false}
        />
      </div>
    </>
  );
}

export default App;