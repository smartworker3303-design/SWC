# Supabase Database Integration & Setup Guidelines

This document details how to configure **Supabase** as the backend database for Saleem Watch Center (SWC). Once connected, the admin panel will synchronize all inserts, updates, and deletes in real-time.

---

## 1. Create a Supabase Project

1. Visit [Supabase](https://supabase.com) and sign in.
2. Click **New Project** and select your organization.
3. Enter your project details:
   - **Name**: `saleem-watch-center` (or any name)
   - **Database Password**: Choose a secure password (make sure to note it down)
   - **Region**: Select a region close to your target audience (e.g., Singapore, Europe, US)
4. Click **Create new project** and wait a few minutes for the database to provision.

---

## 2. Initialize Database Tables

1. In the Supabase Sidebar, click on the **SQL Editor** tab (represented by the `SQL` icon).
2. Click **New Query** to open a blank editor.
3. Paste the following SQL script to create the `products` table, configure Row Level Security (RLS), and set up permissions:

```sql
-- Create the products table
create table products (
  id text primary key,
  name text not null,
  category text not null check (category in ('hand-watches', 'wall-clocks')),
  price numeric not null,
  rating numeric not null default 5.0,
  reviews integer not null default 0,
  image text not null,
  description text not null,
  specs jsonb not null default '{}'::jsonb,
  featured boolean not null default false,
  tag text
);

-- Create the profiles table to track users
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  phone text,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create the orders table
create table orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  items jsonb not null,
  total_amount numeric not null,
  status text not null check (status in ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')) default 'Pending',
  shipping_address text not null,
  phone text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table products enable row level security;
alter table profiles enable row level security;
alter table orders enable row level security;

-- Products Policies
create policy "Allow public read access" on products for select using (true);
create policy "Allow anonymous write access" on products for all using (true) with check (true);

-- Profiles Policies
create policy "Users can view their own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);
create policy "Allow anonymous profile creation" on profiles for insert with check (true);

-- Orders Policies
create policy "Users can view their own orders" on orders for select using (auth.uid() = user_id);
create policy "Users can create their own orders" on orders for insert with check (auth.uid() = user_id);
-- Admin override (for simplicity, we allow all for now, but in production use an admin role)
create policy "Allow admin full access to orders" on orders for all using (true) with check (true);
create policy "Allow admin full access to profiles" on profiles for all using (true) with check (true);
```

4. Click the **Run** button at the bottom-right of the SQL editor. You should see a success message indicating the query returned 0 rows successfully.

---

## 3. Configure Next.js Environment Keys

1. In the Supabase Sidebar, navigate to the **Settings** (gear icon) > **API**.
2. Locate the following keys in the **Project API keys** and **Connection Info** sections:
   - **Project URL** (e.g., `https://xxxx.supabase.co`)
   - **anon/public API key** (this is safe to expose on the client-side)
3. In your local Next.js project directory, create a file named `.env.local` if it does not already exist.
4. Add the keys as variables:

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key-here
```

5. **Restart your development server** (`npm run dev`) to load these newly registered environment keys.

---

## 4. Verify Sync Status

1. Navigate to `/admin-panel` on your browser.
2. Sign in with:
   - **Email**: `basit@gmail.com`
   - **Password**: `AFSafs@123`
3. If keys are loaded correctly, the green status banner **"Supabase Live Connection Active"** will be displayed in the overview.
4. Click the **Reset Catalog** button to seed your cloud database with the default timepieces.
5. In the Supabase Sidebar, click on the **Table Editor** (grid icon) and select `products` to verify that all timepiece entries are populated.
