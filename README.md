<div align="center">

# 🎵 TARANG

### *Where Music Finds Its Stage*

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

*A safety-first platform connecting verified artists with event organizers across India*

[🌐 Live Demo](https://tarang-2026.vercel.app) · [Report Bug](https://github.com/Deepjyoti1307/hult-prize-jadavpur/issues) · [Request Feature](https://github.com/Deepjyoti1307/hult-prize-jadavpur/issues)

</div>

---

## ✨ Features

### 🎤 For Artists
- **Verified Profiles** — Build trust with identity verification badges
- **Smart Booking Management** — Accept, decline, and track gigs effortlessly
- **Earnings Dashboard** — Track revenue, pending payments, and transaction history
- **Safety First** — Emergency SOS, live location sharing, trusted contacts
- **Real-time Messaging** — Communicate directly with clients

### 🎉 For Event Organizers
- **Discover Talent** — Browse artists by category, location, and price range
- **Secure Bookings** — Escrow-protected payments for peace of mind
- **Favorites List** — Save and compare artists for your events
- **Instant Communication** — Chat with artists before booking
- **Incident Reporting** — 24/7 support for any issues

### 🛡️ Safety Features
- **Identity Verification** — Aadhaar/PAN verification for all artists
- **Escrow Payments** — Funds released only after successful events
- **Emergency SOS** — One-tap alert to emergency contacts
- **Live Location Sharing** — Real-time tracking during events
- **24/7 Support Helpline** — Dedicated safety team

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS, Framer Motion |
| **Backend** | Firebase (Auth, Firestore, Storage) |
| **UI Components** | Radix UI, Lucide Icons |
| **Animations** | Motion, Lottie |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm / yarn / pnpm
- Firebase project with Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Deepjyoti1307/hult-prize-jadavpur.git
   cd hult-prize-jadavpur
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

> 💡 **Or visit the live deployment at [tarang-2026.vercel.app](https://tarang-2026.vercel.app)**

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard
│   ├── artist/            # Artist portal
│   │   ├── dashboard/
│   │   ├── bookings/
│   │   ├── earnings/
│   │   ├── messages/
│   │   └── settings/
│   ├── client/            # Client portal
│   │   ├── dashboard/
│   │   ├── search/
│   │   ├── bookings/
│   │   ├── favorites/
│   │   └── messages/
│   └── (public)/          # Landing, login, signup
├── components/            # Reusable UI components
├── contexts/              # React Context providers
└── lib/                   # Utilities & Firebase config
```

---


</div>

---

## 🗺️ Roadmap

- [x] User Authentication (Email + Google OAuth)
- [x] Artist & Client Dashboards
- [x] Booking System with Status Management
- [x] Admin Panel for Verification Approval
- [x] Favorites & Search Functionality
- [ ] Real-time Messaging (In Progress)
- [ ] Payment Integration (Razorpay)
- [ ] Push Notifications
- [ ] Review & Rating System
- [ ] Mobile App (React Native)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Built with ❤️ for **Hult Prize Jadavpur 2026** by Team Tarang

---

<div align="center">

**[⬆ Back to Top](#-tarang)**

</div>

