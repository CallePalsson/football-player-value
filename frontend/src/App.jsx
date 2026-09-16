import { useState } from 'react'
import MagicRings from './MagicRings'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import './wallet.css'
import './form.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <span className="badge">AI PLAYER VALUATION ENGINE</span>
      <h1
        className="sliced-title"
        style={{ '--text': "'FOOTBALL VALUATION'" }}
      >
        <span>Football</span> Valuation
      </h1>


      {/* <span className='input'>
        <input type="text" name="text" className="input" placeholder="Age"></input>
        <input type="text" name="text" className="input" placeholder="Position"></input>
        <input type="text" name="text" className="input" placeholder="Goals"></input>
        <input type="text" name="text" className="input" placeholder="Assists"></input>
        <input type="text" name="text" className="input" placeholder="League"></input>
        <button>Submit</button>
      </span> */}

      <div className="login-box">
        <p>Valuation</p>
        <form>
          <div className="user-box">
            <input required="" name="goals" type="number" />
            <label>Goals</label>
          </div>
          <div className="user-box">
            <input required="" name="assists" type="number" />
            <label>Assists</label>
          </div>
          <div className="user-box">
            <input required="" name="league" type="text" />
            <label>League</label>
          </div>
          <div className="user-box">
            <input required="" name="position" type="text" />
            <label>Position</label>
          </div>
          <div className="user-box">
            <input required="" name="games" type="number" />
            <label>Games</label>
          </div>
          <div className="user-box">
            <input required="" name="age" type="number" />
            <label>Age</label>
          </div>
          <a href="#">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Get Valuation
          </a>
        </form>
        <p>See other <a href="#" className="a2">Valuations</a></p>
      </div>

      

              <>
  <div className="login-box">
    <p>Valuation</p>
    <form>
      <div className="user-box">
        <input required="" name="goals" type="number" />
        <label>Goals</label>
      </div>
      <div className="user-box">
        <input required="" name="assists" type="number" />
        <label>Assists</label>
      </div>
      <div className="user-box">
        <input required="" name="league" type="text" />
        <label>League</label>
      </div>
      <div className="user-box">
        <input required="" name="position" type="text" />
        <label>Position</label>
      </div>
      <div className="user-box">
        <input required="" name="games" type="number" />
        <label>Games</label>
      </div>
      <div className="user-box">
        <input required="" name="age" type="number" />
        <label>Age</label>
      </div>
      <a href="#">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        Get Valuation
      </a>
    </form>
    <p>See other <a href="#" className="a2">Valuations</a></p>
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
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
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
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
              <line x1="3" y1="3" x2="21" y2="21" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</>


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
    
  )
}

export default App