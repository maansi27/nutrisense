import { useEffect, useRef, useState } from 'react'
import { Barcode, Camera, Search, CheckCircle2, AlertTriangle, XCircle, ImagePlus, Sparkles, ScanLine } from 'lucide-react'
import { Card, CardHead, Chip, ScoreRing, Bar, Section, useApp } from '../ui'
import { PRODUCTS } from '../data'
import { assess, alternativesFor, perServing, FLAG_LABEL } from '../logic'

const REASON_ICON = { good: CheckCircle2, warn: AlertTriangle, bad: XCircle }
const FLAG_TONE = { sugar: 'bad', refined: 'warn', fat: 'warn', additive: 'warn', whole: 'good' }

export default function Scan() {
  const { profile, pendingScan, setPendingScan, scans, setScans } = useApp()
  const [mode, setMode] = useState('barcode')
  const [busy, setBusy] = useState(null)
  const [food, setFood] = useState(null)
  const [query, setQuery] = useState('')
  const [code, setCode] = useState('')
  const [img, setImg] = useState(null)
  const [ocr, setOcr] = useState(null)
  const file = useRef()

  const show = (f, delay = 0, label) => {
    setFood(null)
    setBusy(label || 'Analysing…')
    setTimeout(() => {
      setBusy(null)
      setFood(f)
      setScans((s) => [f.id, ...s.filter((x) => x !== f.id)].slice(0, 8))
    }, delay)
  }

  // arriving from Home (recent scan click / search box)
  useEffect(() => {
    if (!pendingScan) return
    if (pendingScan.id) show(PRODUCTS.find((p) => p.id === pendingScan.id))
    if (pendingScan.q) {
      setMode('search'); setQuery(pendingScan.q)
      const hit = search(pendingScan.q)[0]
      if (hit) show(hit)
    }
    setPendingScan(null)
    // eslint-disable-next-line
  }, [])

  const search = (q) => PRODUCTS.filter((p) => (p.name + p.brand + p.group).toLowerCase().includes(q.toLowerCase()))
  const a = food ? assess(food, profile) : null
  const alts = food ? alternativesFor(food, profile) : []

  const scanCode = (c) => {
    const f = PRODUCTS.find((p) => p.barcode === c)
    setCode(c)
    if (f) show(f, 1100, 'Looking up barcode…')
    else { setFood(null); setBusy(null); alert('Barcode not found in this prototype’s sample database. Try one of the samples.') }
  }

  const onFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setImg(URL.createObjectURL(f))
    runOcr(PRODUCTS[f.size % PRODUCTS.length])
  }
  const runOcr = (prod) => {
    setOcr(null); setFood(null); setBusy('Reading label with OCR…')
    setTimeout(() => {
      setOcr(prod.ingredients.join(', '))
      setBusy('Understanding ingredients…')
      setTimeout(() => { setBusy(null); setFood(prod); setScans((s) => [prod.id, ...s.filter((x) => x !== prod.id)].slice(0, 8)) }, 900)
    }, 1100)
  }

  return (
    <>
      <Section title="Scan a food" sub="Is this food suitable for you? Get a score, the reasons behind it, and better alternatives." />
      <div className="two">
        <Card>
          <div className="seg">
            {[['barcode', Barcode, 'Barcode'], ['label', Camera, 'Label photo'], ['search', Search, 'Search']].map(([id, I, l]) => (
              <button key={id} className={mode === id ? 'on' : ''} onClick={() => setMode(id)}><I size={16} />{l}</button>
            ))}
          </div>

          {mode === 'barcode' && (
            <>
              <div className="viewfinder">
                <div className="vf-frame"><i /><i /><i /><i />
                  <div className="bars-code">{[3,1,2,1,4,1,1,3,2,1,3,1,2,4,1,2,1,3,1,1,2,3,1,2].map((w, i) => <b key={i} style={{ width: w * 2.2, opacity: i % 3 ? 1 : 0.6 }} />)}</div>
                  <div className="vf-line" />
                </div>
                <span className="vf-hint">Prototype camera · tap a sample below to simulate a scan</span>
              </div>
              <div className="field" style={{ marginBottom: 14 }}>
                <label>Enter barcode manually</label>
                <div className="row">
                  <input className="input" placeholder="e.g. 8901001000011" value={code} onChange={(e) => setCode(e.target.value)} />
                  <button className="btn dark" onClick={() => scanCode(code.trim())}>Go</button>
                </div>
              </div>
              <Samples onPick={(p) => scanCode(p.barcode)} />
            </>
          )}

          {mode === 'label' && (
            <>
              <div className="dropzone" onClick={() => file.current.click()}>
                {img ? <img src={img} alt="Uploaded label" /> : (
                  <><ImagePlus size={34} color="#7c5cff" /><p style={{ fontWeight: 700, marginTop: 8 }}>Upload or capture a label photo</p>
                    <p className="muted small">Ingredient list is read with OCR, then analysed</p></>
                )}
                <input ref={file} type="file" accept="image/*" capture="environment" hidden onChange={onFile} />
              </div>
              <p className="small muted" style={{ marginBottom: 10 }}>Prototype: OCR is simulated. Pick a sample label instead:</p>
              <Samples onPick={(p) => { setImg(null); runOcr(p) }} />
              {ocr && <div className="small" style={{ marginTop: 14, background: '#f7f6fb', borderRadius: 16, padding: 14 }}><b>OCR text:</b><br />{ocr}</div>}
            </>
          )}

          {mode === 'search' && (
            <>
              <div className="field" style={{ margin: '16px 0' }}>
                <label>Search packaged foods</label>
                <input className="input" placeholder="Try “oats”, “noodles”, “yogurt”…" value={query} onChange={(e) => setQuery(e.target.value)} autoFocus />
              </div>
              {(query ? search(query) : PRODUCTS).slice(0, 8).map((p) => (
                <div key={p.id} className="scan-row" onClick={() => show(p, 400)}>
                  <div className="food-emoji">{p.emoji}</div>
                  <div className="grow"><b>{p.name}</b><div className="small muted">{p.brand} · {p.group}</div></div>
                  <div className={`mini-score ${assess(p, profile).verdict.tone}`}>{assess(p, profile).score}</div>
                </div>
              ))}
            </>
          )}
        </Card>

        {/* Result */}
        <div className="stack">
          {busy && <Card><div className="scanning"><div className="spinner" /><b>{busy}</b><span className="muted small">Matching against your goal and restrictions</span></div></Card>}
          {!busy && !food && (
            <Card><div className="empty"><div className="big-e">🔍</div><h3>Nothing scanned yet</h3><p>Scan a barcode, upload a label photo, or search to see how well a food fits <b>your</b> profile.</p></div></Card>
          )}
          {!busy && food && a && (
            <>
              <Card>
                <div className="result-top">
                  <ScoreRing value={a.score} tone={a.verdict.tone} />
                  <div className="grow" style={{ minWidth: 220 }}>
                    <div className="row" style={{ gap: 8, marginBottom: 6 }}><span style={{ fontSize: 28 }}>{food.emoji}</span><Chip>{food.group}</Chip></div>
                    <h3 style={{ fontSize: 20 }}>{food.name}</h3>
                    <p className="muted small" style={{ margin: '2px 0 10px' }}>{food.brand} · serving {food.serving} g</p>
                    <div className={`verdict ${a.verdict.tone}`}>{a.verdict.label}</div>
                    <p className="muted" style={{ marginTop: 4 }}>{a.verdict.blurb}</p>
                  </div>
                </div>
              </Card>

              <Card>
                <CardHead icon={<Sparkles size={17} />} title="Why this score" sub="for your profile" />
                {a.reasons.map((r, i) => {
                  const I = REASON_ICON[r.type]
                  return <div key={i} className={`reason ${r.type}`}><I size={18} /><span>{r.text}</span></div>
                })}
              </Card>

              <Card>
                <CardHead icon={<ScanLine size={17} />} title="Ingredients read from label" />
                <div className="ing-flags">
                  {a.flagged.map((f, i) => <Chip key={i} tone={FLAG_TONE[f.k] || ''}>{f.t}{f.k && <b style={{ fontWeight: 700 }}> · {FLAG_LABEL[f.k]}</b>}</Chip>)}
                </div>
                <h4 style={{ margin: '20px 0 10px' }}>One serving ({food.serving} g) vs your daily needs</h4>
                <div className="serv-grid">
                  {perServing(food, profile).map((s) => (
                    <div key={s.k} className="serv">
                      <small>{s.k}</small><b>{s.val}<small> {s.unit}</small></b>
                      <Bar pct={s.pct} tone={s.good ? 'good' : s.pct > 0.3 ? 'bad' : s.pct > 0.15 ? 'warn' : 'purple'} />
                      <small>{Math.round(s.pct * 100)}% of daily</small>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <CardHead icon={<CheckCircle2 size={17} />} title="Better alternatives for you" />
                {alts.length === 0 && <p className="muted">This is already one of the best options in the sample database.</p>}
                {alts.map((x) => (
                  <div key={x.food.id} className="alt" onClick={() => show(x.food, 500)} style={{ cursor: 'pointer' }}>
                    <div className="food-emoji" style={{ background: '#fff' }}>{x.food.emoji}</div>
                    <div className="grow"><b>{x.food.name}</b><div className="small muted">{x.reasons.find((r) => r.type === 'good')?.text || x.verdict.blurb}</div></div>
                    <div className={`mini-score ${x.verdict.tone}`}>{x.score}</div>
                  </div>
                ))}
              </Card>
            </>
          )}
        </div>
      </div>
    </>
  )
}

function Samples({ onPick }) {
  return (
    <div>
      <div className="small muted" style={{ marginBottom: 8, fontWeight: 600 }}>Sample products</div>
      <div className="sample-grid">
        {PRODUCTS.slice(0, 10).map((p) => <button key={p.id} className="sample" onClick={() => onPick(p)}><span>{p.emoji}</span>{p.name.split(' ').slice(0, 2).join(' ')}</button>)}
      </div>
    </div>
  )
}
