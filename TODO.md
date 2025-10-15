# TODO: Build Next.js Admin Panel

## 1. Install Dependencies ✅
- Add next-auth, mongoose, bcryptjs, @types/bcryptjs, @auth/mongodb-adapter to package.json
- Run npm install

## 2. Set Up NextAuth Configuration ✅
- Create src/lib/auth.ts for NextAuth config
- Set up providers (e.g., credentials for email/password)
- Configure MongoDB adapter

## 3. Create MongoDB Connection ✅
- Create src/lib/mongodb.ts for database connection

## 4. Build Modular Layout with Sidebar ✅
- Update src/app/layout.tsx to include sidebar and auth context
- Create src/components/Sidebar.tsx component
- Create src/components/Layout.tsx for main layout wrapper

## 5. Create Dashboard Page ✅
- Create src/app/dashboard/page.tsx with overview stats

## 6. Implement Product CRUD ✅
- Create API routes: src/app/api/products/route.ts (GET, POST), src/app/api/products/[id]/route.ts (GET, PUT, DELETE)
- Create pages: src/app/products/page.tsx (list), src/app/products/add/page.tsx, src/app/products/[id]/edit/page.tsx
- Use forms for add/edit with validation

## 7. Order Management with Mock Data ✅
- Create src/app/orders/page.tsx with static mock data for orders
- Display in table format

## 8. User Management with Mock Data ✅
- Create src/app/users/page.tsx with static mock data for users
- Display in table format

## 9. Authentication Setup ✅
- Create src/app/login/page.tsx for login form
- Create src/middleware.ts to protect routes
- Update src/app/page.tsx to redirect based on auth

## 10. Styling and Testing
- Ensure all components use Tailwind CSS for responsive UI
- Test authentication flow
- Test CRUD operations
- Run npm run dev and verify UI
- Set up environment variables (.env.local) for NEXTAUTH_SECRET, MONGODB_URI, etc.
