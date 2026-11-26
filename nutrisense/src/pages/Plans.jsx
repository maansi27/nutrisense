import { useState } from 'react'
import { RefreshCw, Sparkles, Flame, Clock } from 'lucide-react'
import { Card, CardHead, Chip, Section, Bar, useApp } from '../ui'
import { MEALS } from '../data'
import { SLOTS, buildPlan, candidates, dayTotals, whyMeal } from '../logic'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function Plans() {
  const { plan, setPlan, profile, t, today, setToday } = useApp()
  const [view, setView] = useState('day')
  const tot = dayTotals(plan[today])

  const swap = (slot) => {
    const c = candidates(profile, SLOTS[slot].type)
    const cur = plan[today][slot]
    const next = c[(c.findIndex((m) => m.id === cur) + 1) % c.length]
    setPlan(plan.map((d, i) => (i === today ? d.map((id, s) => (s === slot ? next.id : id)) : d)))
  }

  return (
    <>
      <Section title="Meal plans" sub="Generated from your goal, targets and restrictions. Swap any meal for a suitable substitute."
        right={<div className="row wrap">
          <div className="seg"><button className={view === 'day' ? 'on' : ''} onClick={() => setView('day')}>Daily</button><button className={view === 'week' ? 'on' : ''} onClick={() => setView('week')}>Weekly</button></div>
          <button className="btn dark sm" onClick={() => setPlan(buildPlan(profile))}><RefreshCw size={14} /> Regenerate</button>
        </div>} />

      <div className="week">
        {DAYS.map((d, i) => {
          const k = dayTotals(plan[i]).kcal
          return <div key={d} className={`dcard ${i === today ? 'on' : ''}`} onClick={() => { setToday(i); setView('day') }}>
            <small>{d}</small><b>{22 + i}</b><div className="mini">{k} kcal</div>
          </div>
        })}
      </div>

      {view === 'day' ? (
        <div className="plan-layout">
          <div>
            {SLOTS.map((s, i) => {
              const m = MEALS.find((x) => x.id === plan[today][i])
              if (!m) return <Card key={s.type} style={{ marginBottom: 14 }}><p className="muted">No {s.label.toLowerCase()} fits your restrictions in this prototype's sample data.</p></Card>
              return (
                <div key={s.type} className="slot">
                  <div className={`pic ${m.type}`}>{m.emoji}</div>
                  <div className="grow">
                    <div className="slot-label">{s.label} · {s.time}</div>
                    <h4>{m.name}</h4>
                    <div className="row wrap" style={{ gap: 6 }}>
                      <Chip><Flame size={12} />{m.kcal} kcal</Chip><Chip>P {m.p}g</Chip><Chip>C {m.c}g</Chip><Chip>F {m.f}g</Chip><Chip><Clock size={12} />{m.time} min</Chip>
                    </div>
                    <div className="why"><Sparkles size={13} /> {whyMeal(m, profile)}</div>
                  </div>
                  <button className="btn ghost sm" onClick={() => swap(i)}><RefreshCw size={13} /> Swap</button>
                </div>
              )
            })}
          </div>

          <Card>
            <CardHead icon={<Flame size={17} />} title={`${DAYS[today]} totals`} />
            <div style={{ fontFamily: 'var(--display)', fontSize: 40, fontWeight: 800, lineHeight: 1 }}>{tot.kcal}<span className="muted" style={{ fontSize: 16, fontWeight: 500 }}> / {t.kcal} kcal</span></div>
            <Bar pct={tot.kcal / t.kcal} tone={Math.abs(tot.kcal - t.kcal) < t.kcal * 0.12 ? 'good' : 'warn'} />
            <div style={{ height: 14 }} />
            {[['Protein', tot.p, t.protein, 'purple'], ['Carbs', tot.c, t.carbs, 'purple'], ['Fat', tot.f, t.fat, 'purple'], ['Fibre', tot.fiber, t.fiber, 'good']].map(([l, v, g, tone]) => (
              <div key={l} className="macro-line">
                <div className="row between"><span>{l}</span><span className="muted">{v} / {g} g</span></div>
                <Bar pct={v / g} tone={tone} />
              </div>
            ))}
            <p className="small muted">Targets come from your profile ({profile.goal === 'diabetes' ? 'lower-carb split for glucose monitoring' : 'goal-based macro split'}).</p>
          </Card>
        </div>
      ) : (
        <Card>
          <table className="week-table">
            <thead><tr><th>Day</th>{SLOTS.map((s) => <th key={s.type}>{s.label}</th>)}<th>kcal</th></tr></thead>
            <tbody>
              {plan.map((d, di) => (
                <tr key={di}>
                  <td>{DAYS[di]}</td>
                  {d.map((id, si) => { const m = MEALS.find((x) => x.id === id); return <td key={si}>{m ? `${m.emoji} ${m.name}` : '—'}</td> })}
                  <td>{dayTotals(d).kcal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  )
}
