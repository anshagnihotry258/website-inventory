# PEC Venue Booking & Digital Permission System (Website Inventory)

An end-to-end web application for **Punjab Engineering College (PEC Chandigarh)** that streamlines venue booking, timetable conflict checking, and official room permission generation with a **5-Tier Sequential Digital Signature Workflow**.

**Live Deployment:** [https://anshagnihotry258.github.io/website-inventory/](https://anshagnihotry258.github.io/website-inventory/)  
**GitHub Repository:** [https://github.com/anshagnihotry258/website-inventory](https://github.com/anshagnihotry258/website-inventory)

---

## 🏛️ Project Overview

Historically, student societies at PEC had to print physical paper Performa sheets and walk them through multiple academic offices to obtain physical signatures. This platform digitizes the entire lifecycle:
1. **Browse Availability & Calendar**: Real-time room availability grids for Lecture Halls, Tutorial Rooms, and Auditoriums.
2. **Apply via Docify**: Free-form venue booking with support for multi-day events, differing daily schedules, and automated double-booking conflict detection.
3. **5-Tier Sequential Digital Approvals**: Each authority reviews, adds remarks, and signs with a digital signature canvas or verified token.
4. **Official Performa Generation**: Automatically formats the exact official PEC Performa document complete with official college logos, seal, table data, and timestamped digital signatures for PDF export or printing.
5. **DSA & Admin Analytics**: Administrative statistics on room utilization, active societies, and approval pipeline health.

---

## ✨ Key Features

### 1. 📜 Official Performa Format & Exact Styling
- Matches the official Punjab Engineering College Performa layout:
  - **Header with Dual Logos**:
    - **Top Left**: Official PEC logo (*"PEC EXPLORE INNOVATE EXCEL"*).
    - **Center**: `PUNJAB ENGINEERING COLLEGE (DEEMED TO BE UNIVERSITY) CHANDIGARH`.
    - **Top Right**: Official circular PEC seal emblem.
  - **Standard Titles**:
    - `Performa for Booking OF Lecture Rooms by Clubs/ Society/NSS/Sports & departments` (centered, bold, underlined).
    - `P/I Security` (left-aligned, bold, underlined).
  - **8-Row Bordered Data Table**:
    1. Name of Club/Society
    2. Event Name
    3. Brief Event Description
    4. Date (with day names, e.g., `19/09/2026 (Saturday) and 20/09/2026 (Sunday)`)
    5. Time (e.g., `Saturday : 5:00 PM - 8:00 PM`, `Sunday : 9:00 AM – 8:00 PM`)
    6. Room Number (e.g., `L20,21,22,23`)
    7. Department (e.g., `ECE dept (CSRC)`)
    8. Expected participation & Audience
  - **Official Disclaimers & Notes**: Undertaking regarding institute property responsibility, discipline maintenance, and financial assistance query.
  - **5-Signatory Layout**:
    - Top row: `(Secretary/J. Secretary)` and `(CCS/CSTS)`.
    - Bottom row: `(Officer Incharge)`, `(ADSA)`, and `(DSA)`.
    - Digital signatures, names, and exact timestamps (`DD/MM/YYYY, HH:MM:SS`) are printed directly above each title.
  - **Export & Print**: Printable at any stage of approval starting with Secretary.

### 2. ✍️ 5-Tier Sequential Approval Chain
Applications move through a 5-stage verification order:
1. **Secretary (Seccy)** — `Shashvat`
2. **Prof. In-Charge (P/I)** — `Prof. Deepak Kumar`
3. **Convenor JCSTS / CSTS** — `Daiwik`
4. **Associate Dean Student Affairs (ADSA)** — `Prof. M.P. Garg`
5. **Dean Student Affairs (DSA)** — `Prof. Puneet Kaur`

### 3. 👑 Admin Selective Signature & Impersonation Panel
- **Admin Role Selector**: Administrator can act as any officer from a quick dropdown.
- **Selective Signing**: Checkbox panel allowing the administrator to sign on behalf of any stage (1, 2, 3, 4, 5, or all 5 at once).
- **Dimmed State**: Buttons disable and show confirmation once signed at a given level.

### 4. 🔄 "Request Edit" & "Edit & Resubmit" Workflow
- Officers can click **"Request Edit"** to send applications back with feedback/remarks.
- Status changes to `MODIFICATION_REQUESTED`.
- Students see the officer remarks and click **"Edit & Resubmit"** to open `/docify` with all previous data pre-filled, modify timings or venues, and resubmit into the approval chain.

### 5. 📊 Administrative Analytics Dashboard
- Displayed on `/approvals` for DSA, ADSA, and Admin:
  - **Metric Cards**: Total Applications, Fully Sanctioned, Pending Signatures, Modification Requests.
  - **Venue Utilization**: Visual percentage progress bars for most popular rooms (`L20`, `L21`, `Auditorium`, etc.).
  - **Societies Leaderboard**: Request breakdown across IEEE, Robotics Society, ASME, etc.

### 6. 📅 Venue Availability & Calendar
- **Availability Grid**: Visual grid matching institute scheduling sheets with direct *"Get Permission for this room, time"* buttons.
- **Calendar View**: Day, Week, and Month scheduling views showing booked time blocks.
- **Double Booking Conflict Engine**: Prevents overlapping reservations for the same venue and time slot.
- **Timing Validation**: Validates that event End Time is strictly after Start Time.

### 7. 🔐 User Accounts & Persistent Backend
- Session state persisted via `localStorage` with real-time cross-tab synchronization.
- **Account Management Tab**: Change password with validation, stored in persistent local database.

---

## 👥 Default Login Credentials

| Role | Name | Designation | Username | Password |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Administrator | System Super Admin | `admin` | `admin` |
| **Secretary** | Shashvat | Secretary (Seccy) | `shashvat` | `1` |
| **Prof. In-Charge** | Prof. Deepak Kumar | Prof. In-Charge (P/I) | `prof deepak kumar` | `1` |
| **Convenor CSTS** | Daiwik | Convenor JCSTS / CSTS | `daiwik` | `1` |
| **ADSA** | Prof. M.P. Garg | Associate Dean SA (ADSA) | `prof mp garg` | `1` |
| **DSA** | Prof. Puneet Kaur | Dean Student Affairs (DSA) | `prof puneet kaur` | `1` |
| **Society** | IEEE Student Branch | Society Lead | `ieee` | `1` |
| **Society** | Robotics Society | Society Lead | `robotics` | `1` |
| **Society** | ASME PEC Chapter | Society Lead | `asme` | `1` |

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Static HTML Export)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Canvas Signature**: HTML5 Canvas with drawing & touch support
- **Animations / Celebrations**: `canvas-confetti`
- **Deployment**: [GitHub Pages](https://pages.github.com/) via `gh-pages`

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or newer)
- npm or yarn

### Installation
```bash
# Clone repository
git clone https://github.com/anshagnihotry258/website-inventory.git
cd website-inventory

# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production / GitHub Pages
```bash
# Build optimized static export
npm run build

# Deploy to GitHub Pages (gh-pages branch)
npx gh-pages -d out -b gh-pages
```

---

## 📁 Project Structure

```
website-inventory/
├── public/
│   ├── pec-logo.png               # Official PEC colored logo
│   └── pec-seal.png               # Official PEC circular seal
├── src/
│   ├── app/
│   │   ├── account/page.tsx       # Password management & account details
│   │   ├── approvals/page.tsx     # 5-stage approval pipeline, admin panel & analytics
│   │   ├── availability/page.tsx  # Venue availability schedule & direct booking links
│   │   ├── calendar/page.tsx      # Venue schedule calendar
│   │   ├── docify/page.tsx        # Room permission generator & edit resubmission
│   │   ├── document/page.tsx      # Query-param document viewer (/document?id=...)
│   │   ├── document/[id]/         # Dynamic route document viewer (/document/perm_001)
│   │   ├── login/page.tsx         # Authentication login page
│   │   ├── layout.tsx             # Root application layout
│   │   └── page.tsx               # Home dashboard
│   ├── components/
│   │   ├── ApprovalTimeline.tsx   # 5-stage progress indicator
│   │   ├── Navbar.tsx             # Institute navigation bar & profile switcher
│   │   ├── OfficialPerforma.tsx   # Official PEC Performa document layout
│   │   └── SignatureModal.tsx     # Digital signature drawing modal
│   └── lib/
│       ├── auth.ts                # User accounts & session management
│       ├── db.ts                  # Persistent storage, conflict checks & permissions DB
│       ├── logos.ts               # Base64 encoded PEC logo & seal for zero 404s
│       └── types.ts               # TypeScript data definitions
├── next.config.js                 # Next.js static export & GitHub Pages configuration
├── package.json
└── README.md
```

---

## 📜 License
Punjab Engineering College (PEC Chandigarh). Built for academic & student society administrative convenience.
