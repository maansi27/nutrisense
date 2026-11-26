import { Clock, Pencil, ArrowUpRight, Search, FileBarChart2, Plus, Flame, Drumstick, Wheat, Droplet, ScanLine, ChevronRight, Check, UtensilsCrossed } from 'lucide-react'
import { Card, CardHead, Chip, MacroRing, Bar, useApp } from '../ui'
import { SLOTS, assess, dayTotals, greeting, whyMeal } from '../logic'
import { MEALS, PRODUCTS, GOALS } from '../data'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function Home() {
  const { profile, t, plan, done, setDone, water, setWater, glucose, scans, go, setPendingScan, today, setToday, updateProfile } = useApp()
  const dayPlan = plan[today]
  const eatenIds = dayPlan.filter((_, i) => done[`${today}-${i}`])
  const eaten = dayTotals(eatenIds)
  const planned = dayTotals(dayPlan)
  const goal = GOALS.find((g) => g.id === profile.goal)
  const lastG = glucose[glucose.length - 1]
  const featured = MEALS.find((m) => m.id === dayPlan[1]) || MEALS[0]
  const activities = 4 + (done ? Object.values(done).filter(Boolean).length : 0)
  const weekKcal = plan.map((d, i) => dayTotals(d).kcal)

  return (
    <>
      <div className="hero-row">
        <div className="hello">
          <h1>{greeting()}, <b>{profile.name}</b></h1>
          <p className="muted">You have <b style={{ color: 'var(--ink)' }}>{dayPlan.length + 1} activities</b> today · Goal: {goal.emoji} {goal.label}</p>
        </div>
        <div className="searchbar">
          <Search size={18} />
          <input placeholder="Search a food, brand or barcode to check suitability…"
            onKeyDown={(e) => { if (e.key === 'Enter' && e.target.value.trim()) { setPendingScan({ q: e.target.value.trim() }); go('scan') } }} />
        </div>
      </div>

      <div className="home-grid">
        {/* Schedule */}
        <Card>
          <CardHead icon={<Clock size={17} />} title="Today's meal plan" right={<button className="round-btn light" onClick={() => go('plans')}><Pencil size={15} /></button>} />
          <div className="date-strip">
            {DAYS.map((d, i) => (
              <div key={d} className={`d ${i === today ? 'on' : ''}`} onClick={() => setToday(i)}>{d}<b>{22 + i}</b></div>
            ))}
          </div>
          <div className="timeline">
            <div className={`t-item ${water >= 0.5 ? 'done' : ''}`}>
              <div className="check">{water >= 0.5 && <Check size={13} />}</div>
              <div><div className="t-time">07:30</div><div className="t-name">Water intake</div></div>
            </div>
            {dayPlan.map((id, i) => {
              const m = MEALS.find((x) => x.id === id)
              if (!m) return null
              const k = `${today}-${i}`
              return (
                <div key={k} className={`t-item ${done[k] ? 'done' : ''}`}>
                  <div className="check" onClick={() => setDone({ ...done, [k]: !done[k] })} style={{ cursor: 'pointer' }}>{done[k] && <Check size={13} />}</div>
                  <div>
                    <div className="t-time">{SLOTS[i].time} · {SLOTS[i].label}</div>
                    <div className="t-name">{m.emoji} {m.name}</div>
                    <div className="row wrap" style={{ gap: 6 }}>
                      <Chip tone={m.type === 'breakfast' ? 'bad' : m.type === 'lunch' ? 'yellow' : m.type === 'dinner' ? 'purple' : 'good'}>{SLOTS[i].label}</Chip>
                      <Chip>{m.kcal} kcal</Chip><Chip>{m.time} min</Chip>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Middle column */}
        <div className="stack">
          <Card>
            <CardHead icon={<FileBarChart2 size={17} />} title="Report" sub="Goals this week" />
            <div className="tiles">
              <div className="tile water">
                <button className="plus" onClick={() => setWater(+(water + 0.25).toFixed(2))} aria-label="Add water"><Plus size={15} /></button>
                <span className="lbl">Water</span>
                <svg className="wave" viewBox="0 0 200 80" preserveAspectRatio="none"><path d="M0 24 Q 25 0 50 24 T 100 24 T 150 24 T 200 24 V80 H0Z" fill="#fff" opacity=".5"><animateTransform attributeName="transform" type="translate" from="-100 0" to="0 0" dur="4s" repeatCount="indefinite" /></path></svg>
                <div className="big" style={{ position: 'relative' }}>{Math.round(water * 1000)}ml<small>Goal {t.water}L</small></div>
              </div>
              <div className="tile weight">
                <span className="lbl">Weight</span>
                <Gauge pct={Math.min(1, profile.goalWeight / profile.weight)} />
                <div className="big">{profile.weight}kg<small>Goal {profile.goalWeight}kg</small></div>
              </div>
              <div className="tile glu">
                <span className="lbl">Glucose</span>
                <Spark data={glucose.slice(-8).map((g) => g.v)} />
                <div className="big">{lastG.v}mg/dL<small>{lastG.ctx}</small></div>
              </div>
              <div className="tile cal">
                <span className="lbl">Calories</span>
                <Gauge pct={Math.min(1, eaten.kcal / t.kcal)} color="#ff6b6b" icon={<Flame size={18} color="#ff6b6b" />} />
                <div className="big">{eaten.kcal}kcal<small>Left {Math.max(0, t.kcal - eaten.kcal)}</small></div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHead icon={<UtensilsCrossed size={17} />} title="Daily intake" sub={`planned ${planned.kcal} / ${t.kcal} kcal`} />
            <div className="macros">
              <MacroRing label="Fats" emoji="🥑" value={eaten.f} goal={t.fat} color="#5bc25b" />
              <MacroRing label="Protein" emoji="🍗" value={eaten.p} goal={t.protein} color="#ff9d3d" />
              <MacroRing label="Carbs" emoji="🍚" value={eaten.c} goal={t.carbs} color="#8f6bff" />
            </div>
            <div className="small muted" style={{ marginTop: 12 }}>Targets: {t.fat} g fat · {t.protein} g protein · {t.carbs} g carbs. Tick meals in your plan to log them.</div>
          </Card>
        </div>

        {/* Featured meal */}
        <div className="stack">
          <Card className="feature">
            <div className="photo">{featured.emoji}<Chip tone="dark" style={{ position: 'absolute', top: 14, left: 14 }}>Today's lunch</Chip></div>
            <div className="body">
              <h3>{featured.name}</h3>
              <p className="muted small">{whyMeal(featured, profile)}.</p>
              <div className="row wrap" style={{ gap: 6, marginTop: 12 }}>
                <Chip tone="good">{featured.type}</Chip><Chip>{featured.kcal} kcal</Chip><Chip>{featured.time} min</Chip>
                <Chip tone={featured.gi === 'low' ? 'good' : featured.gi === 'med' ? 'yellow' : 'bad'}>GI {featured.gi}</Chip>
              </div>
              <div className="ingr-row">
                {featured.ing.slice(0, 4).map((i) => <div key={i} className="ingr"><span className="e">🥬</span>{i}</div>)}
              </div>
              <button className="btn dark block" style={{ marginTop: 18 }} onClick={() => go('plans')}>View full plan <ChevronRight size={16} /></button>
            </div>
          </Card>
        </div>
      </div>

      <div className="home-grid" style={{ marginTop: 20 }}>
        <Card>
          <CardHead icon={<ScanLine size={17} />} title="Recent scans" right={<button className="round-btn" onClick={() => go('scan')}><ArrowUpRight size={16} /></button>} />
          {scans.slice(0, 4).map((id) => {
            const f = PRODUCTS.find((p) => p.id === id)
            const a = assess(f, profile)
            return (
              <div key={id} className="scan-row" onClick={() => { setPendingScan({ id }); go('scan') }}>
                <div className="food-emoji">{f.emoji}</div>
                <div className="grow"><b>{f.name}</b><div className="small muted">{f.brand} · {a.verdict.label}</div></div>
                <div className={`mini-score ${a.verdict.tone}`}>{a.score}</div>
              </div>
            )
          })}
        </Card>

        <Card>
          <CardHead icon={<FileBarChart2 size={17} />} title="Planned calories this week" sub={`target ${t.kcal}`} />
          <div className="bars">
            {weekKcal.map((k, i) => (
              <div key={i} className={`b ${i === today ? 'on' : ''} ${k > t.kcal * 1.05 ? 'over' : ''}`} onClick={() => setToday(i)} style={{ cursor: 'pointer' }}>
                <em>{k}</em>
                <i style={{ height: `${Math.min(100, (k / (t.kcal * 1.2)) * 100) * 0.78}%` }} />
                {DAYS[i]}
              </div>
            ))}
          </div>
        </Card>

        <div className="promo">
          <span className="stars">★★★★★</span>
          <h3>Is this food right for you?</h3>
          <p>Scan a barcode or label and get a personal suitability score, with reasons and better alternatives.</p>
          <div className="pills"><span>Barcode</span><span>Label OCR</span><span>Search</span></div>
          <button className="btn outline block" onClick={() => go('scan')}><ScanLine size={17} /> Scan a food</button>
          <div className="blob">🥗</div>
        </div>
      </div>
    </>
  )
}

function Gauge({ pct, color = '#ff9d3d', icon }) {
  const r = 46, len = Math.PI * r
  return (
    <svg className="gauge" width="120" height="66" viewBox="0 0 120 66">
      <path d="M14 60 A46 46 0 0 1 106 60" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="11" strokeLinecap="round" />
      <path d="M14 60 A46 46 0 0 1 106 60" fill="none" stroke={color} strokeWidth="11" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - pct)} style={{ transition: '0.6s' }} />
      <foreignObject x="48" y="34" width="24" height="24">{icon}</foreignObject>
    </svg>
  )
}

function Spark({ data }) {
  const min = Math.min(...data) - 5, max = Math.max(...data) + 5
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 130},${50 - ((v - min) / (max - min)) * 46}`).join(' ')
  return (
    <svg width="100%" height="54" viewBox="0 0 130 54" preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke="#19b26b" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}
