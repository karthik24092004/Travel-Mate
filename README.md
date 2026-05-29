<div align="center">

# 🧳 TravelMate

### *Your group trip, fully planned — from first day to final bill.*

> Map out your itinerary day by day, track every expense on the go, and settle up fairly when the trip ends.

🌐 **[View Live Demo](https://travelllmate.netlify.app/)**

![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript_5-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

</div>

---

## 🌍 What Is TravelMate?

TravelMate is a **group trip planning app** that takes you from zero to fully organized —  
set up your trip, plan activities for each day, log expenses as you go, and let the app handle the math when it's time to settle.

No spreadsheets. No group chat chaos. Just a clean 5-step flow.

---

## 🗺️ The 5-Step Trip Flow
Setup  →  Itinerary  →  Expenses  →  Summary  →  Settle

**① Setup** — Name your trip, set duration, add travelers  
**② Itinerary** — Plan activities day by day (morning / afternoon / evening slots)  
**③ Expenses** — Log costs by category, assign who paid, split among participants  
**④ Summary** — Visual breakdown of total spend, per-person share, and category charts  
**⑤ Settle** — Greedy algorithm computes the minimum transactions to clear all balances

---

## 🔐 Real Authentication

TravelMate has **actual auth** — email/password sign-up and sign-in powered by **Supabase**, not a fake login screen.

---

## 🛠️ How It's Built

**UI & Frontend**
- React 18 + TypeScript 5 — typed, component-driven architecture
- Vite 5 — fast dev server and optimized builds
- Tailwind CSS v3 + `tailwindcss-animate` — utility-first styling with smooth transitions
- shadcn/ui (Radix UI + CVA) — accessible, headless component primitives
- Lucide React + Sonner — icons and toast notifications

**Data & Logic**
- TanStack React Query v5 — async state and caching
- React Hook Form + Zod — type-safe form validation
- date-fns — clean date manipulation
- localStorage — trip data persisted client-side across sessions

**Visualization**
- Recharts 2 — expense breakdowns, category charts, per-person balances

**Testing**
- Vitest + Testing Library + jsdom

---

## ⚙️ Architecture at a Glance
Browser
├── Auth (Supabase — email/password)
├── Trip Data (localStorage)
├── UI Layer (React + shadcn/ui + Tailwind)
├── State (React Query + hooks)
├── Charts (Recharts)
└── Settlement Engine (Greedy Algorithm — pure TypeScript)

---

## 🗂️ Expense Categories

| | Category |
|---|---|
| ✈️ | Travel |
| 🍔 | Food |
| 🏨 | Stay |
| 📦 | Miscellaneous |

---

<div align="center">

*Plan together. Track as you go. Settle with math.*

</div>
