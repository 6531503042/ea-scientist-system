# Enterprise Architecture System - Next.js

Next.js 15 ของระบบจัดการสถาปัตยกรรมองค์กร

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
frontend-next/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes group
│   │   └── login/         # Login page
│   ├── (app)/       # Dashboard routes group
│   │   ├── layout.tsx    # Dashboard layout
│   │   ├── page.tsx      # Dashboard home
│   │   ├── artefacts/     # Artefacts page
│   │   ├── graph/         # Graph page
│   │   └── ...
│   ├── layout.tsx         # Root layout
│   ├── providers.tsx      # Context providers
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── artefacts/       # Artefact components
│   ├── graph/            # Graph components
│   └── ui/               # shadcn/ui components
├── context/              # React Context providers
├── lib/                  # Utilities & API clients
├── data/                 # Mock data
└── hooks/                # Custom hooks
```

## 🔑 Key Features

- ✅ Next.js 15 App Router
- ✅ TypeScript
- ✅ Tailwind CSS + shadcn/ui
- ✅ React Query for data fetching
- ✅ Framer Motion for animations
- ✅ Authentication & Authorization
- ✅ Multi-language support (TH/EN)
