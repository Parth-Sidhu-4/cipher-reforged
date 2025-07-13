# 🧩 Cipher Reforged

A cryptic puzzle-solving platform inspired by [Cipher Saga 2.0](https://github.com/technocratsgsv/Cipher-Saga-2.0.git), rebuilt from scratch using **SvelteKit v5**, **Firebase**, and a custom Firestore backend.

This repo contains the source code for the puzzle platform used in **Cipher Reforged**, designed to provide an immersive, gamified experience involving logic, encryption, and lateral thinking.

> ⚠️ This platform **does not include any questions** — it is solely the rebuilt technical infrastructure.

---

## 🚀 Live Demo

## [🔗 Click here to view the hosted version](https://cipher-reforged.vercel.app)

## 📦 Tech Stack

- 🧠 **SvelteKit v5**
- 🔥 **Firebase Auth + Firestore** (Client & Admin SDK)
- 🎨 **Tailwind CSS** + **Lucide Icons**
- 🌌 **Gradient Animations**, Soft Glows, Glassmorphism
- 🧪 Real-time leaderboard, team progress tracking, and answer validation

---

## ✨ Features

- 🔐 Firebase authentication
- 🧩 Question-based level progression
- 👥 Team creation, joining, and shared progress
- 🧾 Real-time answer logging for individuals and teams
- 🧮 Leaderboard based on level and timestamp
- ⚙️ Admin backend via Firestore for question management
- 📱 Mobile-optimized UI with responsive navbar

> ⚠️ Note: The original _SvelteFire_ logging features could not be replicated due to lack of Svelte 5 support as of now.

---

## 📁 Setup Instructions

> 🔧 **Requirements:**
>
> - Node.js 18+
> - Firebase project
> - Admin credentials file (service account)

1. **Clone the repository**

   ```bash
   git clone https://github.com/Parth-Sidhu-4/cipher-reforged.git
   cd cipher-reforged
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a `.env` file**

   ```env
   VITE_FIREBASE_API_KEY=your_public_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...

   FB_PROJECT_ID=your-project-id
   FB_CLIENT_EMAIL=...
   FB_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

---

## 🔍 Differences from Cipher Saga 2.0

- ✅ 80% of backend rebuilt from scratch using Firebase Admin SDK
- 🧠 Core logic (question validation, team sync, logging) custom-written
- 🎨 Frontend mostly retained, but optimized for SvelteKit v5 and mobile-first responsiveness
- ⚠️ _Live sync log viewing_ not currently implemented due to SvelteFire incompatibility

---

## 📚 Folder Structure

```
src/
├── lib/
│   ├── firebase/          # Client + Admin Firebase setups
│   ├── components/        # UI components (Navbar, Gradient, Toasts)
│   └── utils/             # Helper methods & Firebase wrappers
├── routes/
│   ├── play/              # Gameplay interface
│   ├── team/              # Team creation/joining pages
│   ├── profile/           # User profile page
│   ├── leaderboard/       # Realtime leaderboard
│   └── api/               # Server endpoints for auth, submit, logs
└── app.css                # Tailwind styles & overrides
```

---

## 🧠 Credits

- 🎓 **Original platform & concept**: [Technocrats, GSV](https://github.com/technocratsgsv)
- 🎨 **Frontend design and UX inspiration**: [Cipher Saga 2.0](https://github.com/technocratsgsv/Cipher-Saga-2.0.git)
- 👨‍💻 **Core Developers of Cipher Saga 2.0**:
  - [Soham Wani](https://github.com/Soham-Wani)
  - [Shreya Mohanty](https://github.com/ShreyaPMohanty6)

- 🧪 **Inspiration for the Original Cipher Saga 2.0 platform**:
  - [Encryptid Finale](https://github.com/kry0sc0pic/encryptid-finale) by [Krishaay](https://github.com/kry0sc0pic)

---
