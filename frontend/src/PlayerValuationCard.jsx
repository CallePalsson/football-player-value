import './player-valuation-card.css'

function getInitials(name) {
    return (name || 'Unknown Player')
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
}

function formatValue(value) {
    return `€${Number(value || 0).toLocaleString('sv-SE')}`
}

function Stat({ label, value, accent = false }) {
    return (
        <div className={`valuation-stat${accent ? ' valuation-stat--accent' : ''}`}>
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    )
}

function PlayerArtwork({ initials, position }) {
    return (
        <div className="valuation-artwork" aria-hidden="true">
            <div className="valuation-stadium-lights" />
            <span className="valuation-initials">{initials}</span>
            <div className="valuation-player">
                <div className="valuation-player__head" />
                <div className="valuation-player__neck" />
                <div className="valuation-player__torso" />
                <div className="valuation-player__arm valuation-player__arm--left" />
                <div className="valuation-player__arm valuation-player__arm--right" />
            </div>
            <span className="valuation-artwork-position">{position || 'TALENT'}<br />DATA<br />VALUE<br />FUTURE</span>
        </div>
    )
}

export default function PlayerValuationCard({ player, index = 0 }) {
    const name = player.player_name || player.name || 'Unknown player'
    const initials = getInitials(name)
    const position = (player.position || 'Unknown position').toUpperCase()

    return (
        <article className="valuation-card">
            <div className="valuation-card__foil" />
            <div className="valuation-card__inner">
                <header className="valuation-header">
                    <span>AI SCOUT REPORT</span>
                    <span>PLAYER VALUATION<br /><b>#{String(index + 1).padStart(2, '0')}</b></span>
                </header>

                <PlayerArtwork initials={initials} position={position} />

                <div className="valuation-nameplate">
                    <h2>{name}</h2>
                    <p>{player.league || 'Unknown league'}</p>
                </div>

                <div className="valuation-stats valuation-stats--top">
                    <Stat label="AGE" value={player.age ?? '-'} accent />
                    <Stat label="GOALS" value={player.goals ?? 0} accent />
                    <Stat label="ASSISTS" value={player.assists ?? 0} accent />
                </div>
                <div className="valuation-stats valuation-stats--bottom">
                    <Stat label="POSITION" value={position} />
                    <Stat label="MINUTES PLAYED" value={player.minutes_played ?? player.minutesPlayed ?? 0} />
                </div>

                <div className="valuation-market-value">
                    <span>ESTIMATED MARKET VALUE</span>
                    <strong>{formatValue(player.predicted_value ?? player.estimatedMarketValue)}</strong>
                </div>

                <footer className="valuation-footer"><i />VALUATION: VERIFIED DATA<i /></footer>
            </div>
        </article>
    )
}