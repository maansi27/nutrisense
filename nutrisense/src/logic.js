import { RESTRICTIONS, TAG_LABEL, MEALS, PRODUCTS } from './data'

// ---------- Targets from the simple user-entered profile ----------
export function targets(p) {
  const bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age + (p.sex === 'female' ? -161 : 5)
  const tdee = bmr * p.activity
  const adj = { loss: -450, gain: 400, maintain: 0, muscle: 250, diabetes: -150, general: 0 }[p.goal]
  const split = {
    loss: [0.3, 0.4, 0.3], gain: [0.2, 0.5, 0.3], muscle: [0.3, 0.45, 0.25],
    diabetes: [0.22, 0.4, 0.38], maintain: [0.2, 0.5, 0.3], general: [0.2, 0.5, 0.3],
  }[p.goal]
  const kcal = Math.round((tdee + adj) / 10) * 10
  const diabetic = p.goal === 'diabetes' || p.diabetes
  return {
    kcal,
    protein: Math.round((kcal * split[0]) / 4),
    carbs: Math.round((kcal * split[1]) / 4),
    fat: Math.round((kcal * split[2]) / 9),
    fiber: 30,
    sugar: diabetic ? 25 : 50,
    sodium: p.bp ? 1500 : 2000,
    water: 3.1,
    bmi: +(p.weight / (p.height / 100) ** 2).toFixed(1),
    goalWeight: p.goalWeight,
  }
}

// map of forbidden tag -> restriction label
export function forbiddenMap(p) {
  const m = {}
  p.restrictions.forEach((rid) => {
    const r = RESTRICTIONS.find((x) => x.id === rid)
    r?.forbids.forEach((t) => (m[t] = r.label))
  })
  return m
}

// ---------- Ingredient-text classifier (lightweight "NLP") ----------
const RULES = [
  ['sugar', /\b(sugar|glucose|fructose|syrup|jaggery|dextrose|honey)\b/i],
  ['refined', /\b(maida|refined wheat|refined flour|white flour)\b/i],
  ['fat', /\b(palm oil|hydrogenated|vanaspati|shortening)\b/i],
  ['additive', /\((\d{3}[a-z]?(, ?\d{3})*)\)|flavour enhancer|preservative|emulsifier|artificial|colour|acidity regulator/i],
  ['whole', /\b(whole grain|oats|millet|ragi|chickpea|dal|lentil|sprout|jowar|bajra|dates|almond|rice bran)\b/i],
]
export function classifyIngredient(text) {
  for (const [k, re] of RULES) if (re.test(text)) return k
  return null
}
export const FLAG_LABEL = { sugar: 'Added sugar', refined: 'Refined flour', fat: 'Low-quality fat', additive: 'Additive', whole: 'Wholesome' }

// ---------- Suitability scoring ----------
export function assess(food, p) {
  const d = food.per100
  const forb = forbiddenMap(p)
  const diabetic = p.goal === 'diabetes' || p.diabetes
  let s = 70
  const reasons = []
  const add = (type, text, delta = 0) => { s += delta; reasons.push({ type, text }) }

  const conflicts = food.contains.filter((c) => forb[c])
  const seen = new Set()
  conflicts.forEach((c) => {
    if (seen.has(forb[c] + c)) return
    seen.add(forb[c] + c)
    reasons.push({ type: 'bad', text: `Contains ${TAG_LABEL[c]} — conflicts with your “${forb[c]}” setting.` })
  })

  // sugar
  if (d.sugar > 15) add('bad', `High sugar (${d.sugar} g/100 g)${diabetic ? ' — a concern for glucose monitoring' : ''}.`, -(d.sugar - 15) * (diabetic ? 2 : 1.2))
  else if (d.sugar > 8) add('warn', `Moderate sugar (${d.sugar} g/100 g).`, -(d.sugar - 8) * (diabetic ? 1.6 : 0.8))
  else add('good', `Low sugar (${d.sugar} g/100 g).`, 5)

  // sodium
  if (d.sodium > 800) add('bad', `Very high sodium (${d.sodium} mg/100 g)${p.bp ? ' — matters with your blood-pressure restriction' : ''}.`, -((d.sodium - 800) / 60) * (p.bp ? 1.6 : 1))
  else if (d.sodium > 400) add('warn', `Moderate sodium (${d.sodium} mg/100 g).`, p.bp ? -8 : -3)

  // saturated fat
  if (d.satfat > 7) add('bad', `High saturated fat (${d.satfat} g/100 g).`, -12)
  else if (d.satfat > 4) add('warn', `Moderate saturated fat (${d.satfat} g/100 g).`, -5)

  // fibre
  if (d.fiber >= 6) add('good', `Rich in fibre (${d.fiber} g/100 g) — keeps you fuller, slows sugar release.`, diabetic ? 12 : 8)
  else if (d.fiber < 2 && d.carbs > 40) add('warn', 'Low fibre for a high-carb food.', -5)

  // goal-specific
  switch (p.goal) {
    case 'loss':
      if (d.kcal > 400) add('bad', `Energy dense (${d.kcal} kcal/100 g) — easy to overeat on a weight-loss plan.`, -10)
      else if (d.kcal < 200) add('good', `Light on calories (${d.kcal} kcal/100 g).`, 8)
      if (d.protein >= 10) add('good', `Good protein (${d.protein} g/100 g) helps satiety while cutting.`, 7)
      break
    case 'gain':
      if (d.kcal >= 380) add('good', `Calorie-dense (${d.kcal} kcal/100 g) — helps reach a surplus.`, 8)
      else if (d.kcal < 100) add('warn', 'Very low in calories for a weight-gain goal.', -4)
      break
    case 'muscle':
      if (d.protein >= 15) add('good', `High protein (${d.protein} g/100 g) supports muscle gain.`, 12)
      else if (d.protein < 5) add('warn', `Low protein (${d.protein} g/100 g) for a muscle-gain goal.`, -7)
      break
    case 'diabetes':
      if (d.carbs > 60) add('warn', `High carbohydrate (${d.carbs} g/100 g) — likely to raise post-meal glucose.`, -8)
      break
    default:
      if (d.protein >= 10) add('good', `Good protein (${d.protein} g/100 g).`, 4)
  }

  // ingredient text
  const flagged = food.ingredients.map((t) => ({ t, k: classifyIngredient(t) }))
  const sugarPos = flagged.findIndex((f) => f.k === 'sugar')
  if (sugarPos >= 0 && sugarPos <= 2 && d.sugar > 8) add('warn', `Sugar is ingredient #${sugarPos + 1} on the label.`, -4)
  if (flagged.some((f) => f.k === 'refined')) add('warn', 'Made with refined flour (maida) rather than whole grain.', diabetic ? -8 : -4)
  if (flagged.some((f) => f.k === 'fat')) add('warn', 'Contains palm / hydrogenated fat.', -4)
  if (flagged.filter((f) => f.k === 'additive').length >= 2) add('warn', 'Several additives or flavour enhancers listed.', -3)
  if (flagged.length <= 3 && !flagged.some((f) => f.k === 'sugar' || f.k === 'additive')) add('good', 'Short, simple ingredient list.', 6)

  s = Math.max(0, Math.min(100, Math.round(s)))
  if (conflicts.length) s = Math.min(s, 18)
  const verdict =
    conflicts.length ? { label: 'Avoid', tone: 'bad', blurb: 'Conflicts with your restrictions.' }
    : s >= 75 ? { label: 'Great fit', tone: 'good', blurb: 'Lines up well with your goal.' }
    : s >= 55 ? { label: 'OK in moderation', tone: 'warn', blurb: 'Fine occasionally — mind the portion.' }
    : s >= 35 ? { label: 'Not ideal', tone: 'warn', blurb: 'Better options exist for your goal.' }
    : { label: 'Poor fit', tone: 'bad', blurb: 'Works against your goal.' }

  reasons.sort((a, b) => ({ bad: 0, warn: 1, good: 2 }[a.type] - { bad: 0, warn: 1, good: 2 }[b.type]))
  return { score: s, verdict, reasons, conflicts, flagged }
}

export function alternativesFor(food, p, n = 3) {
  const cur = assess(food, p).score
  return PRODUCTS.filter((x) => x.id !== food.id)
    .map((x) => ({ food: x, ...assess(x, p), same: x.group === food.group }))
    .filter((x) => !x.conflicts.length && x.score > cur)
    .sort((a, b) => Number(b.same) * 20 + b.score - (Number(a.same) * 20 + a.score))
    .slice(0, n)
}

export function perServing(food, p) {
  const t = targets(p)
  const f = food.serving / 100
  const d = food.per100
  return [
    { k: 'Energy', val: Math.round(d.kcal * f), unit: 'kcal', pct: (d.kcal * f) / t.kcal },
    { k: 'Protein', val: +(d.protein * f).toFixed(1), unit: 'g', pct: (d.protein * f) / t.protein, good: true },
    { k: 'Sugar', val: +(d.sugar * f).toFixed(1), unit: 'g', pct: (d.sugar * f) / t.sugar },
    { k: 'Sodium', val: Math.round(d.sodium * f), unit: 'mg', pct: (d.sodium * f) / t.sodium },
  ]
}

// ---------- Meals ----------
export function mealAllowed(m, p) {
  const forb = forbiddenMap(p)
  return !m.contains.some((c) => forb[c])
}

export function mealFit(m, p) {
  const t = targets(p)
  let s = m.goals.includes(p.goal) ? 40 : 10
  if (p.goal === 'diabetes' || p.diabetes) s += m.gi === 'low' ? 25 : m.gi === 'med' ? 5 : -20
  if (p.goal === 'loss') s += 20 - Math.abs(m.kcal - t.kcal / 4) / 12 + m.fiber
  if (p.goal === 'gain') s += m.kcal / 25
  if (p.goal === 'muscle') s += m.p
  s += m.fiber
  return s
}

export const SLOTS = [
  { type: 'breakfast', label: 'Breakfast', time: '08:00' },
  { type: 'lunch', label: 'Lunch', time: '13:00' },
  { type: 'snack', label: 'Evening snack', time: '17:00' },
  { type: 'dinner', label: 'Dinner', time: '20:00' },
]

export function candidates(p, type) {
  return MEALS.filter((m) => m.type === type && mealAllowed(m, p)).sort((a, b) => mealFit(b, p) - mealFit(a, p))
}

// plan[day][slotIndex] = meal id
export function buildPlan(p) {
  return Array.from({ length: 7 }, (_, d) =>
    SLOTS.map((s) => {
      const c = candidates(p, s.type)
      const top = c.slice(0, Math.min(4, c.length))
      return top.length ? top[d % top.length].id : null
    }),
  )
}

export function dayTotals(ids) {
  const ms = ids.map((id) => MEALS.find((m) => m.id === id)).filter(Boolean)
  return ms.reduce((a, m) => ({ kcal: a.kcal + m.kcal, p: a.p + m.p, c: a.c + m.c, f: a.f + m.f, fiber: a.fiber + m.fiber }), { kcal: 0, p: 0, c: 0, f: 0, fiber: 0 })
}

export function whyMeal(m, p) {
  if (p.goal === 'diabetes' && m.gi === 'low') return 'Low glycaemic — gentler on blood sugar'
  if (p.goal === 'muscle' && m.p >= 20) return `${m.p} g protein for muscle gain`
  if (p.goal === 'loss' && m.fiber >= 7) return `${m.fiber} g fibre keeps you full`
  if (p.goal === 'gain' && m.kcal >= 400) return 'Calorie-dense for a surplus'
  return 'Balanced for your goal'
}

export function ingredientMatch(m, pantry) {
  const have = m.ing.filter((i) => pantry.includes(i))
  const missing = m.ing.filter((i) => !pantry.includes(i))
  return { have, missing, pct: m.ing.length ? have.length / m.ing.length : 0 }
}

export const greeting = () => {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}
