import { useState } from 'react'
import { RefreshCw, Sparkles, Flame, Clock, Check, Plus, X, PartyPopper, Search } from 'lucide-react'
import { Card, CardHead, Chip, Section, Bar, useApp } from '../ui'
import { MEALS } from '../data'
import { SLOTS, buildPlan, candidates, dayTotals, eatenTotals, mealAllowed, whyMeal } from '../logic'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function Plans() {
  const { plan, setPlan, profile, t, today, setToday, done, setDone, logged, setLogged, cheat, setCheat } = useApp()
  const [view, setView] = useState('day')
  const [slot, setSlot] = useState('lunch')
  const [q, setQ] = useState('')
  const [custom, setCustom] = useState({ name: '', kcal: '', p: '', c: '', f: '' })
  const [showCustom, setShowCustom] = useState(false)

  const isCheat = !!cheat[today]
  const planned = dayTotals(plan[today])
  const eaten = eatenTotals(plan, done, logged, today)
  const dayLog = logged[today] || []
  const cheatCount = Object.values(cheat).filter(Boolean).length

  const swap = (s) => {
    const c = candidates(profile, SLOTS[s].type)
    if (!c.length) return
    const cur = plan[today][s]
    const next = c[(c.findIndex((m) => m.id === cur) + 1) % c.length]
    setPlan(plan.map((d, i) => (i === today ? d.map((id, k) => (k === s ? next.id : id)) : d)))
  }
  const addLog = (entry) => setLogged({ ...logged, [today]: [...dayLog, { ...entry, slot: SLOTS.find((x) => x.type === slot).label }] })
  const removeLog = (i) => setLogged({ ...logged, [today]: dayLog.filter((_, k) => k !== i) })
  const addMeal = (m) => { addLog({ id: m.id, name: m.name, emoji: m.emoji, kcal: m.kcal, p: m.p, c: m.c, f: m.f, fiber: m.fiber }); setQ('') }
  const addCustom = () => {
    if (!custom.name.trim()) return
    addLog({ name: custom.name.trim(), emoji: '🍽️', kcal: +custom.kcal || 0, p: +custom.p || 0, c: +custom.c || 0, f: +custom.f || 0 })
    setCustom({ name: '', kcal: '', p: '', c: '', f: '' }); setShowCustom(false)
  }
  const results = (q ? MEALS.filter((m) => m.name.toLowerCase().includes(q.toLowerCase())) : MEALS.filter((m) => m.type === slot && mealAllowed(m, profile))).slice(0, 6)

  return (
    <>
      <Section title="Meal plans" sub="Generated from your goal, targets and restrictions. Swap meals, log what you actually ate, and mark cheat days."
        right={<div className="row wrap">
          <div className="seg"><button className={view === 'day' ? 'on' : ''} onClick={() => setView('day')}>Daily</button><button className={view === 'week' ? 'on' : ''} onClick={() => setView('week')}>Weekly</button></div>
          <button className="btn dark sm" onClick={() => setPlan(buildPlan(profile))}><RefreshCw size={14} /> Regenerate</button>
        </div>} />

      <div className="week">
        {DAYS.map((d, i) => {
          const k = dayTotals(plan[i]).kcal
          return <div key={d} className={`dcard ${i === today ? 'on' : ''} ${cheat[i] ? 'cheat' : ''}`} onClick={() => { setToday(i); setView('day') }}>
            <small>{d}</small><b>{22 + i}</b><div className="mini">{cheat[i] ? '🍕 Cheat day' : `${k} kcal`}</div>
          </div>
        })}
      </div>

      {view === 'day' ? (
        <div className="plan-layout">
          <div>
            <div className="row between wrap" style={{ marginBottom: 14 }}>
              <h3 style={{ fontSize: 20 }}>{DAYS[today]} · {22 + today}</h3>
              <button className={`btn sm ${isCheat ? 'cheat-on' : 'ghost'}`} onClick={() => setCheat({ ...cheat, [today]: !isCheat })}>
                <PartyPopper size={14} /> {isCheat ? 'Cheat day on — undo' : 'Mark as cheat day'}
              </button>
            </div>
            {isCheat && <div className="cheat-banner big">🍕 <div><b>It's a cheat day!</b><span>No calorie or nutrient targets today — enjoy it guilt-free. Log what you eat below and tomorrow's plan carries on as normal. The plan below is optional.</span></div></div>}

            {SLOTS.map((s, i) => {
              const m = MEALS.find((x) => x.id === plan[today][i])
              if (!m) return <Card key={s.type} style={{ marginBottom: 14 }}><p className="muted">No {s.label.toLowerCase()} fits your restrictions in this prototype's sample data.</p></Card>
              const k = `${today}-${i}`
              return (
                <div key={s.type} className={`slot ${isCheat ? 'dim' : ''}`}>
                  <div className={`pic ${m.type}`}>{m.emoji}</div>
                  <div className="grow">
                    <div className="slot-label">{s.label} · {s.time}{isCheat && ' · optional'}</div>
                    <h4>{m.name}</h4>
                    <div className="row wrap" style={{ gap: 6 }}>
                      <Chip><Flame size={12} />{m.kcal} kcal</Chip><Chip>P {m.p}g</Chip><Chip>C {m.c}g</Chip><Chip>F {m.f}g</Chip><Chip><Clock size={12} />{m.time} min</Chip>
                    </div>
                    <div className="why"><Sparkles size={13} /> {whyMeal(m, profile)}</div>
                  </div>
                  <div className="stack" style={{ gap: 8 }}>
                    <button className={`btn sm ${done[k] ? 'purple' : 'ghost'}`} onClick={() => setDone({ ...done, [k]: !done[k] })}><Check size={13} /> {done[k] ? 'Ate it' : 'I ate this'}</button>
                    <button className="btn ghost sm" onClick={() => swap(i)}><RefreshCw size={13} /> Swap</button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="stack">
            <Card>
              <CardHead icon={<Flame size={17} />} title={`${DAYS[today]} intake`} sub={isCheat ? 'cheat day' : undefined} />
              <div style={{ fontFamily: 'var(--display)', fontSize: 40, fontWeight: 800, lineHeight: 1 }}>{eaten.kcal}<span className="muted" style={{ fontSize: 16, fontWeight: 500 }}> {isCheat ? 'kcal eaten' : `/ ${t.kcal} kcal`}</span></div>
              {!isCheat && <Bar pct={eaten.kcal / t.kcal} tone={eaten.kcal > t.kcal * 1.1 ? 'bad' : 'good'} />}
              <div className="small muted" style={{ margin: '6px 0 14px' }}>{isCheat ? 'No targets enforced today.' : `Plan covers ${planned.kcal} kcal · tick “I ate this” or log meals to track.`}</div>
              {!isCheat && [['Protein', eaten.p, t.protein], ['Carbs', eaten.c, t.carbs], ['Fat', eaten.f, t.fat], ['Fibre', eaten.fiber, t.fiber]].map(([l, v, g]) => (
                <div key={l} className="macro-line"><div className="row between"><span>{l}</span><span className="muted">{v} / {g} g</span></div><Bar pct={v / g} tone={l === 'Fibre' ? 'good' : 'purple'} /></div>
              ))}
              {isCheat && <div className="row wrap" style={{ gap: 6 }}><Chip>P {eaten.p}g</Chip><Chip>C {eaten.c}g</Chip><Chip>F {eaten.f}g</Chip></div>}
            </Card>

            <Card>
              <CardHead icon={<Plus size={17} />} title="Log what you ate" />
              <div className="seg" style={{ marginBottom: 12 }}>{SLOTS.map((s) => <button key={s.type} className={slot === s.type ? 'on' : ''} onClick={() => setSlot(s.type)}>{s.label.replace('Evening ', '')}</button>)}</div>
              <div className="searchbar" style={{ boxShadow: 'none', background: '#f5f4f9', padding: '10px 16px' }}><Search size={16} /><input placeholder="Search meals (e.g. poha, dal)…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
              <div style={{ margin: '10px 0' }}>
                {results.map((m) => (
                  <div key={m.id} className="scan-row" onClick={() => addMeal(m)} style={{ padding: '8px 0' }}>
                    <div className="food-emoji" style={{ width: 38, height: 38, fontSize: 20 }}>{m.emoji}</div>
                    <div className="grow"><b style={{ fontSize: 13.5 }}>{m.name}</b><div className="small muted">{m.kcal} kcal</div></div>
                    <span className="round-btn light" style={{ width: 28, height: 28 }}><Plus size={14} /></span>
                  </div>
                ))}
                {!results.length && <p className="small muted">No match — add it as a custom meal below.</p>}
              </div>
              {!showCustom ? <button className="btn ghost sm block" onClick={() => setShowCustom(true)}>+ Add something else (custom)</button> : (
                <div className="stack" style={{ gap: 8 }}>
                  <input className="input" placeholder="What did you eat? (e.g. pizza slice)" value={custom.name} onChange={(e) => setCustom({ ...custom, name: e.target.value })} />
                  <div className="row" style={{ gap: 6 }}>
                    {[['kcal', 'kcal'], ['p', 'Prot g'], ['c', 'Carb g'], ['f', 'Fat g']].map(([k, l]) => <input key={k} className="input" style={{ padding: '10px 8px', minWidth: 0 }} type="number" placeholder={l} value={custom[k]} onChange={(e) => setCustom({ ...custom, [k]: e.target.value })} />)}
                  </div>
                  <button className="btn primary sm" onClick={addCustom}>Add to {DAYS[today]}</button>
                </div>
              )}
              {dayLog.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div className="small muted" style={{ fontWeight: 700, marginBottom: 4 }}>LOGGED {DAYS[today].toUpperCase()}</div>
                  {dayLog.map((m, i) => (
                    <div key={i} className="log-row"><span style={{ fontSize: 20 }}>{m.emoji}</span><div className="grow"><b style={{ fontSize: 13.5 }}>{m.name}</b><div className="small muted">{m.slot} · {m.kcal} kcal</div></div>
                      <button className="round-btn light" style={{ width: 28, height: 28 }} onClick={() => removeLog(i)} aria-label="Remove"><X size={13} /></button></div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      ) : (
        <Card>
          <div className="small muted" style={{ marginBottom: 8 }}>{cheatCount ? `${cheatCount} cheat day${cheatCount > 1 ? 's' : ''} this week 🍕` : 'Tap a day, then “Mark as cheat day” to add one.'}</div>
          <table className="week-table">
            <thead><tr><th>Day</th>{SLOTS.map((s) => <th key={s.type}>{s.label}</th>)}<th>kcal</th></tr></thead>
            <tbody>
              {plan.map((d, di) => (
                <tr key={di} className={cheat[di] ? 'cheat-row' : ''}>
                  <td>{DAYS[di]}</td>
                  {cheat[di]
                    ? <td colSpan={4}>🍕 Cheat day — no targets{(logged[di] || []).length ? ` · logged: ${(logged[di] || []).map((m) => m.name).join(', ')}` : ''}</td>
                    : d.map((id, si) => { const m = MEALS.find((x) => x.id === id); return <td key={si}>{m ? `${m.emoji} ${m.name}` : '—'}</td> })}
                  <td>{cheat[di] ? eatenTotals(plan, done, logged, di).kcal : dayTotals(d).kcal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  )
}
