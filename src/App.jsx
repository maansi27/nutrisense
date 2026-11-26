import { useMemo, useState } from 'react'
import { Home as HomeIcon, ScanLine, Refrigerator, CalendarDays, Activity, MapPin, Bell, Leaf } from 'lucide-react'
import { AppCtx, Disclaimer } from './ui'
import { buildPlan, targets } from './logic'
import { SEED_GLUCOSE, SAMPLE_PANTRY, PRODUCTS } from './data'
import Home from './pages/Home'
import Scan from './pages/Scan'
import Ingredients from './pages/Ingredients'
import Plans from './pages/Plans'
import Health from './pages/Health'
import Care from './pages/Care'
import Profile from './pages/Profile'
import Onboarding from './pages/Onboarding'

const NAV = [
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'scan', label: 'Scan Food', icon: ScanLine },
  { id: 'ingredients', label: 'Ingredients', icon: Refrigerator },
  { id: 'plans', label: 'Meal Plans', icon: CalendarDays },
  { id: 'health', label: 'Health Log', icon: Activity },
  { id: 'care', label: 'Find Care', icon: MapPin },
]

export default function App() {
  const [page, setPage] = useState('home')
  const [onboarded, setOnboarded] = useState(false)
  const [profile, setProfile] = useState({
    name: 'Friend', sex: 'female', age: 25, height: 165, weight: 60, goalWeight: 60, activity: 1.375,
    goal: 'general', restrictions: [], diabetes: false, bp: false, gt: null,
  })
  const [plan, setPlan] = useState(() => buildPlan({ goal: 'general', restrictions: [] }))
  const [done, setDone] = useState({ '0-0': true })
  const [water, setWater] = useState(1.5)
  const [glucose, setGlucose] = useState(SEED_GLUCOSE)
  const [pantry, setPantry] = useState(SAMPLE_PANTRY)
  const [scans, setScans] = useState([PRODUCTS[2], PRODUCTS[0], PRODUCTS[8]].map((p) => p.id))
  const [pendingScan, setPendingScan] = useState(null)
  const [today, setToday] = useState(0)

  const t = useMemo(() => targets(profile), [profile])

  const updateProfile = (patch) => {
    const next = { ...profile, ...patch }
    setProfile(next)
    setPlan(buildPlan(next)) // plan regenerates whenever goals/restrictions change
    setDone({})
  }

  const finishOnboarding = (p) => { updateProfile(p); setPage('home'); setOnboarded(true) }
  const ctx = {
    restart: () => setOnboarded(false),
    page, go: setPage, profile, updateProfile, t, plan, setPlan, done, setDone, water, setWater,
    glucose, setGlucose, pantry, setPantry, scans, setScans, pendingScan, setPendingScan, today, setToday,
  }

  const Page = { home: Home, scan: Scan, ingredients: Ingredients, plans: Plans, health: Health, care: Care, profile: Profile }[page]

  if (!onboarded) return <Onboarding initial={profile.gt ? profile : undefined} onDone={finishOnboarding} />

  return (
    <AppCtx.Provider value={ctx}>
      <div className="shell">
        <header className="topbar">
          <div className="logo" title="NutriSense"><Leaf size={22} /></div>
          <nav className="nav">
            {NAV.map(({ id, label, icon: I }) => (
              <button key={id} className={page === id ? 'on' : ''} onClick={() => setPage(id)}>
                <I size={17} /> {label}
              </button>
            ))}
          </nav>
          <button className="icon-btn hide-m" aria-label="Notifications"><Bell size={18} /><span className="pip" /></button>
          <div className="me" onClick={() => setPage('profile')}>
            <div className="avatar">{profile.name[0]}</div>
            <div><b>{profile.name}</b><span>Edit profile</span></div>
          </div>
        </header>
        <main className="page" key={page}><Page /></main>
        <Disclaimer />
        <p className="footer">NutriSense · Prototype · AI-Assisted Goal-Based Personalized Nutrition</p>
      </div>
    </AppCtx.Provider>
  )
}
