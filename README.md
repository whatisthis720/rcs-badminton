# Rc's — Racquets Cult — Deployment Guide

This is a standard Vite + React project with a Supabase-backed admin
dashboard for tracking bookings. It needs Node.js installed on your
computer (download from nodejs.org if you don't have it — the LTS version).

---

## Part 1 — Set up the database (Supabase)

1. Go to **supabase.com**, sign up free, and create a new project.
   Pick any name/region; save the database password it gives you somewhere
   safe (you likely won't need it again, but keep it).
2. Once the project finishes provisioning, go to the **SQL Editor** in the
   left sidebar → **New Query**.
3. Open `supabase/schema.sql` from this folder, copy the whole thing,
   paste it into the SQL editor, and click **Run**. This creates the
   `bookings` table and locks it down so only you can read/write it.
4. Go to **Authentication → Users** in the sidebar → **Add User**.
   Create yourself a login: use `rcsbadminton@gmail.com` and pick a
   password. This is what you'll use to log into `/admin` on the live
   site — keep it somewhere safe, it's not recoverable via the site itself
   (you'd reset it from the Supabase dashboard if you ever forget it).
5. Go to **Settings → API**. You'll need two values from this page in a
   moment: **Project URL** and the **anon / public** key.

## Part 2 — Connect the site to your database

1. In this project folder, copy `.env.example` to a new file named `.env`.
2. Open `.env` and paste in your Project URL and anon key from Step 5 above:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
3. Save the file. **Never commit this file or share it publicly** — the
   `.gitignore` already excludes it, but worth knowing.

## Part 3 — Install and test locally

Open a terminal in this folder and run:

    npm install

Then:

    npm run dev

This opens the site at http://localhost:5173. Check the main page looks
right, then go to **http://localhost:5173/admin** — you should see a
login screen. Sign in with the email/password you created in Part 1,
Step 4, and try adding a test booking.

Also test that "Request An Invitation" on the main page creates a record in
your Supabase `bookings` table with status `pending`.

## Part 4 — Deploy

### Option A: Vercel (recommended)

1. Create a free account at vercel.com (sign in with GitHub).
2. Push this folder to a new GitHub repository.
3. In Vercel, click "Add New Project," import that repository.
4. Vercel auto-detects Vite — before deploying, add your environment
   variables: in the project settings, under **Environment Variables**,
   add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` with the same
   values from your `.env` file.
5. Click Deploy. You'll get a live URL like `rcs-badminton.vercel.app`.

### Option B: Netlify

Netlify Drop (the drag-and-drop method) won't work for this version,
because it can't read your `.env` file — you need Netlify to build the
project itself so it can inject the environment variables.

1. Create a free account at netlify.com (sign in with GitHub).
2. Push this folder to a new GitHub repository.
3. In Netlify, click "Add new site" → "Import an existing project" →
   pick the repo.
4. Netlify auto-detects Vite. Before deploying, go to **Site settings →
   Environment variables** and add `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY`.
5. Deploy. You'll get a live URL like `rcs-badminton.netlify.app`.

## After deploying

1. Visit your live URL, submit "Request An Invitation" for real, and
   check `/admin` or your Supabase dashboard to verify the new booking.
2. Visit `your-live-url.com/admin`, log in, and add a real booking to
   confirm the database connection works in production too.

## Day-to-day use

- **`/admin`** on your live site is where you log and manage bookings —
  add students, set session date/time, mark confirmed/cancelled, delete.
- You can also view/edit the raw data anytime from the Supabase dashboard
  under **Table Editor → bookings**, without needing the site at all.
- "Request An Invitation" submissions insert directly into the Supabase
  `bookings` table with status `pending`, appearing immediately in your
  `/admin` schedule dashboard.
