# Naman Kanwar — 3D Interactive Portfolio

![Live Deployment](https://img.shields.io/badge/Live-Vercel-black?style=for-the-badge&logo=vercel)
![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js)
![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Welcome to the source code of my immersive, 3D interactive portfolio. The site acts as an interactive "AI System Interface", containing mini-games, dynamic WebGL post-processing, cinematic scroll animations, and an intelligent ChatBot.

### 🚀 **Live Demo:** [https://portfolio-g2jb6p8l0-namankanwar11s-projects.vercel.app/](https://portfolio-g2jb6p8l0-namankanwar11s-projects.vercel.app/)

---

## ⚡ Core Features

- **Cinematic WebGL Environments:** Powered by `Three.js` and `React Three Fiber`, featuring volumetric lighting, instanced particle systems, and bloom/vignette post-processing.
- **"Hack the System" Mini-Game:** A custom 3D puzzle featuring hardware node networking, sequential logic unlocking, and keyboard accessibility.
- **AI Knowledge Assistant:** An integrated context-aware ChatBot ("Kanwar AI") with fuzzy-matching to answer recruiter questions about my experience and skills.
- **Terminal CLI:** A fully interactive terminal replacing the standard contact form, featuring commands like `connect`, `socials`, `help`, and `clear`.
- **Performance Optimized:** Uses `IntersectionObserver` viewport isolation, Tab Visibility pausing, and dynamic Device Pixel Ratio scaling to lock 60FPS.
- **Cinematic Polish:** `Lenis` smooth scrolling, `Framer Motion` micro-interactions, and a bespoke dynamic synthesizer Web Audio engine via `Howler.js`.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **3D Engine:** Three.js, React Three Fiber, React Three Drei, Postprocessing
- **Motion & Audio:** Framer Motion, Lenis (Smooth Scroll), Howler.js
- **Backend Analytics / API:** Node.js, Express, MongoDB (located in `/backend`)

## 💻 Local Execution

To run the frontend Next.js project locally:
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000`.
