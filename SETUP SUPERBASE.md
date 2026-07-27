# Setting up Supabase for this site

This is a one-time setup. Once it's done, you (Sammy) can add gallery images
and review community submissions any time just by logging in — no coding
required.

## 1. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) and sign up (it's free).
2. Click **New Project**.
3. Give it a name, and set a database password when asked. Save that
   password somewhere safe — it's not the password you'll log into the
   *site* with, it's just for the database itself.
4. Wait a minute or two while it's created.

## 2. Get your API keys

1. In your new project, click the gear icon → **Settings → API**.
2. Copy the **Project URL** and the **anon public** key.
   (Never use the "service_role" key anywhere — only the "anon public" one.)
3. Open `js/supabase-config.js` in this project and paste them in:
   ```js
   const SUPABASE_URL = "paste your Project URL here";
   const SUPABASE_ANON_KEY = "paste your anon public key here";
   ```

## 3. Set up the database

1. In Supabase, click **SQL Editor** in the left sidebar → **New query**.
2. Open `supabase/setup.sql` in this project, copy all of it, and paste it
   into that query box.
3. Click **Run** (bottom right, or `Ctrl+Enter`).
4. You should see a success message. This one step creates both tables
   (`gallery_images` and `community_portfolios`) and all their security
   rules — you won't need to run it again.

## 4. Create your login

1. In Supabase, click **Authentication** in the left sidebar → **Users**.
2. Click **Add user** → **Create new user**.
3. Type in the email and password you want to log in with, and check
   **Auto Confirm User**.
4. That's your one and only admin account — there's no public sign-up
   anywhere on the site.

## 5. You're set up! Here's how to use it day-to-day

- Go to `admin-login.html` on the site (there's also a small "Admin" link
  in the site's footer) and log in with the email/password from step 4.
- **To add a gallery image:** on the admin page, under "My Gallery," choose
  a file and click **Upload Image**. It appears in the homepage gallery
  right away. Click **Delete** under any image to remove it.
- **To review community submissions:** under "Community Submissions," every
  link someone has submitted shows up here — marked **Pending** until you
  click **Approve** (after which it appears on the public homepage), or
  **Delete** to remove it entirely (works whether it's pending or already
  approved/live).

## Where does someone else submit their portfolio link?

That part is already live on the site — no setup needed. Anyone visiting
the homepage can scroll to the **Community Portfolios** section and fill in
the "Share Your Portfolio" form (their name + their published Notion link).
It gets saved as **pending** and simply won't show up publicly until you
approve it from the admin page.
