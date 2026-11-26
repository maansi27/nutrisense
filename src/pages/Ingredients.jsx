import { useState } from 'react'
import { X, Plus, Refrigerator, Flame, Clock } from 'lucide-react'
import { Card, CardHead, Chip, Section, useApp } from '../ui'
import { MEALS, PANTRY_SUGGESTIONS, SAMPLE_PANTRY } from '../data'
import { ingredientMatch, mealAllowed, mealFit, whyMeal } from '../logic'

export default function Ingredients() {
  const { pantry, setPantry, profile } = useApp()
  const [txt, setTxt] = useState('')
  const add = (v) => { v = v.trim().toLowerCase(); if (v && !pantry.includes(v)) setPantry([...pantry, v]); setTxt('') }

  const ranked = MEALS.filter((m) => mealAllowed(m, profile))
    .map((m) => ({ m, ...ingredientMatch(m, pantry) }))
    .filter((x) => x.have.length > 0)
    .sort((a, b) => b.pct - a.pct || mealFit(b.m, profile) - mealFit(a.m, profile))
  const hidden = MEALS.filter((m) => !mealAllowed(m, profile)).length

  return (
    <>
      <Section title="What's in your kitchen?" sub="Enter the ingredients you have — we'll rank meal ideas that fit your goal and restrictions." />
      <Card style={{ marginBottom: 24 }}>
        <CardHead icon={<Refrigerator size={17} />} title="Available ingredients" right={<div className="row"><button className="btn ghost sm" onClick={() => setPantry(SAMPLE_PANTRY)}>Use sample</button><button className="btn ghost sm" onClick={() => setPantry([])}>Clear</button></div>} />
        <div className="pantry-box">
          {pantry.map((p) => <span key={p} className="chip">{p}<button onClick={() => setPantry(pantry.filter((x) => x !== p))} aria-label={`remove ${p}`}><X size={11} /></button></span>)}
          <input placeholder="Type an ingredient and press Enter…" value={txt} onChange={(e) => setTxt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add(txt)} />
        </div>
        <div className="suggest">
          {PANTRY_SUGGESTIONS.filter((s) => !pantry.includes(s)).slice(0, 16).map((s) => <button key={s} onClick={() => add(s)}><Plus size={11} style={{ verticalAlign: -1 }} /> {s}</button>)}
        </div>
      </Card>

      <div className="row between wrap" style={{ marginBottom: 14 }}>
        <h3 style={{ fontSize: 20 }}>{ranked.length} meal ideas</h3>
        {hidden > 0 && <Chip tone="purple">{hidden} meals hidden — conflict with your restrictions</Chip>}
      </div>
      {ranked.length === 0 && <Card><div className="empty"><div className="big-e">🧺</div><p>Add a few ingredients to see meal ideas.</p></div></Card>}
      <div className="meal-grid">
        {ranked.map(({ m, have, missing, pct }) => (
          <div key={m.id} className="meal">
            <div className={`pic ${m.type}`}>{m.emoji}
              <span className="match" style={{ color: pct >= 0.8 ? '#0e8a50' : pct >= 0.5 ? '#c4601a' : '#6b6a78' }}>{Math.round(pct * 100)}% match</span>
            </div>
            <h4>{m.name}</h4>
            <div className="meta">
              <Chip><Flame size={12} />{m.kcal} kcal</Chip><Chip><Clock size={12} />{m.time} min</Chip>
              <Chip tone={m.gi === 'low' ? 'good' : m.gi === 'med' ? 'yellow' : 'bad'}>GI {m.gi}</Chip>
            </div>
            <div className="small" style={{ color: '#0e8a50', fontWeight: 600 }}>✓ {whyMeal(m, profile)}</div>
            <div className="missing">{missing.length ? <>Need: <b>{missing.join(', ')}</b></> : '✅ You have everything'}</div>
          </div>
        ))}
      </div>
    </>
  )
}
