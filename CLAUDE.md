# Claude Code Rules - Enterprise Architecture System

## Overview
This document defines coding standards and best practices for the Enterprise Architecture System project, based on patterns from `bestpractice-frontend-example` (frontend) and `example-production` (full-stack).

---

## Rule 1: Best Practice References

### Frontend Patterns (bestpractice-frontend-example)
- Route Groups: `(app)`, `(auth)` for layout segregation
- Component co-location: `_components/` under each route
- Custom hooks: `hooks/` directory at root level
- Shared UI: `components/ui/` for reusable primitives
- Type definitions: `types/` directory

### Backend Patterns (example-production)
- API versioning: `app/api/v1/[route]/route.ts`
- Repository pattern: `lib/repositories/[entity]/`
- Service layer: `lib/services/[domain]/`
- Validators: `lib/validators/[entity]-validator.ts`
- Database: Prisma with `lib/prisma.ts`

---

## Rule 2: Next.js Structure Standards

### Directory Structure
```
app/
├── (app)/              # Main app routes (authenticated)
│   ├── [module]/
│   │   ├── _components/  # Module-specific components
│   │   ├── page.tsx
│   │   └── layout.tsx (optional)
├── (auth)/             # Auth routes (login, register)
├── api/
│   └── v1/             # Versioned API routes
│       └── [resource]/
│           └── route.ts
├── layout.tsx          # Root layout
└── providers.tsx       # Client providers wrapper

components/
├── ui/                 # shadcn/ui primitives
├── layout/             # Layout components (Sidebar, Header)
└── providers/          # Context providers

lib/
├── api/                # API handlers/utilities
├── repositories/       # Data access layer
├── services/           # Business logic
├── validators/         # Zod schemas
├── types/              # TypeScript types
└── utils/              # Utility functions

hooks/                  # Custom React hooks
types/                  # Global type definitions
```

### Page Structure
```tsx
// app/(app)/[module]/page.tsx
'use client';

import { ComponentA } from './_components/ComponentA';
import { useModuleHook } from '@/hooks/useModuleHook';

export default function ModulePage() {
  // 1. Hooks at the top
  const { data, loading } = useModuleHook();
  
  // 2. Early returns for loading/error states
  if (loading) return <Skeleton />;
  
  // 3. Main render
  return (
    <div className="...">
      <PageHeader />
      <ComponentA data={data} />
    </div>
  );
}
```

---

## Rule 3: Code File Size Limits

### Maximum Lines: 300-500 lines per file

**When to split:**
- Components > 300 lines → Extract sub-components
- Hooks > 200 lines → Split into smaller hooks
- API routes > 200 lines → Extract to service layer
- Utility files > 300 lines → Split by functionality

**How to split:**
```
// Before (single large component)
UserTable.tsx (600 lines)

// After (properly split)
_components/
├── UsersTable.tsx          # Main container (~100 lines)
├── UserTableContent.tsx    # Table body (~150 lines)
├── UserTableHeader.tsx     # Search, filters (~80 lines)
├── UserTablePagination.tsx # Pagination (~60 lines)
└── UserCellRenderer.tsx    # Cell renderers (~100 lines)
```

---

## Rule 4: Backend Architecture (Next.js API)

### API Route Pattern
```
app/api/v1/[resource]/route.ts
```

### Layer Separation
```
API Route (route.ts)
    ↓ Validation (validators/*)
    ↓ Service (services/*)
    ↓ Repository (repositories/*)
    ↓ Database (Prisma)
```

### Example API Route
```tsx
// app/api/v1/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { userValidator } from '@/lib/validators/user-validator';
import { UserService } from '@/lib/services/users/user-service';

export async function GET(req: NextRequest) {
  try {
    const users = await UserService.getAll();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = userValidator.parse(body);
    const user = await UserService.create(validated);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Validation failed' }, { status: 400 });
  }
}
```

### Service Pattern
```tsx
// lib/services/users/user-service.ts
import { UserRepository } from '@/lib/repositories/users/user-repository';
import type { CreateUserInput, User } from '@/lib/types/user';

export class UserService {
  static async getAll(): Promise<User[]> {
    return UserRepository.findAll();
  }

  static async create(data: CreateUserInput): Promise<User> {
    // Business logic here
    return UserRepository.create(data);
  }
}
```

### Repository Pattern
```tsx
// lib/repositories/users/user-repository.ts
import { prisma } from '@/lib/prisma';
import type { User, CreateUserInput } from '@/lib/types/user';

export class UserRepository {
  static async findAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  static async create(data: CreateUserInput): Promise<User> {
    return prisma.user.create({ data });
  }
}
```

---

## Rule 5: Component Organization

### Smart vs Dumb Components
```
Smart (Container):     Dumb (Presentational):
- Manages state        - Receives props
- Calls APIs           - Pure rendering
- Handle side effects  - No state/effects
```

### Component Structure
```tsx
// _components/ComponentName.tsx
'use client';

import { useState, useCallback } from 'react';
// 1. External imports
import { motion } from 'framer-motion';
// 2. UI imports
import { Button } from '@/components/ui/button';
// 3. Local imports
import type { ComponentProps } from './types';

// 4. Types (if small, otherwise separate file)
interface Props extends ComponentProps {
  onAction: () => void;
}

// 5. Constants (if needed)
const DEFAULT_VALUES = { ... };

// 6. Component
export function ComponentName({ onAction, ...props }: Props) {
  // Hooks first
  const [state, setState] = useState();
  
  // Callbacks
  const handleClick = useCallback(() => {
    // ...
  }, []);
  
  // Render
  return (
    <div>...</div>
  );
}
```

---

## Rule 6: TypeScript Standards

### Type Definition Location
- **Global types:** `types/` or `lib/types/`
- **Component props:** Same file if < 20 lines, else `types.ts`
- **API types:** `lib/types/[entity].ts`

### Naming Conventions
```ts
// Interfaces for objects
interface User { ... }
interface CreateUserInput { ... }

// Type for unions/aliases
type UserRole = 'Admin' | 'Manager' | 'User';
type UserStatus = 'active' | 'inactive' | 'suspended';

// Props suffix for components
interface UserTableProps { ... }
interface UserModalProps { ... }
```

---

## Rule 7: Error Handling

### API Routes
```tsx
try {
  // ... operation
} catch (error) {
  console.error('[API Route Name]:', error);
  
  if (error instanceof ZodError) {
    return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 });
  }
  
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
```

### Client Components
```tsx
const { toast } = useToast();

try {
  await api.createUser(data);
  toast({ title: 'Success', description: 'User created' });
} catch (error) {
  toast({ variant: 'destructive', title: 'Error', description: error.message });
}
```

---

## Rule 8: Naming Conventions

### Files
- Components: `PascalCase.tsx` (e.g., `UserTable.tsx`)
- Hooks: `camelCase.ts` (e.g., `useUsers.ts`)
- Utils: `kebab-case.ts` (e.g., `date-utils.ts`)
- Types: `kebab-case.ts` (e.g., `user-types.ts`)

### Functions/Variables
- Components: `PascalCase` (e.g., `UserTable`)
- Hooks: `useCamelCase` (e.g., `useUsers`)
- Utils: `camelCase` (e.g., `formatDate`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_ITEMS`)

---

## Rule 9: Testing Standards

### File Location
```
__tests__/
├── unit/
│   ├── services/
│   └── utils/
├── integration/
│   └── api/
└── e2e/
    └── flows/
```

### Naming
- Unit: `[module].test.ts`
- Integration: `[module].integration.test.ts`
- E2E: `[flow].e2e.test.ts`

---

## Rule 10: Import Order

```tsx
// 1. React/Next
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. External libraries
import { motion } from 'framer-motion';
import { z } from 'zod';

// 3. UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// 4. Layout/shared components
import { PageHeader } from '@/components/layout/PageHeader';

// 5. Local components
import { UserTable } from './_components/UserTable';

// 6. Hooks
import { useUsers } from '@/hooks/useUsers';

// 7. Utils/libs
import { cn } from '@/lib/utils';

// 8. Types
import type { User } from '@/types';
```

---

## Quick Reference

| Category | Pattern | Example |
|----------|---------|---------|
| Route Groups | `(name)` | `(app)`, `(auth)` |
| Private Components | `_components` | `users/_components/` |
| API Versioning | `/api/v1/` | `/api/v1/users/route.ts` |
| Max File Lines | 300-500 | Split if exceeded |
| Service Layer | `lib/services/` | Business logic |
| Repository | `lib/repositories/` | Data access |
| Validators | `lib/validators/` | Zod schemas |
| Types | `lib/types/` or `types/` | TypeScript types |
