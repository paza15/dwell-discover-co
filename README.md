# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/658e2726-9e13-4d9b-9343-0d9f77b2d9fd

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/658e2726-9e13-4d9b-9343-0d9f77b2d9fd) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can the site owner add listings without Supabase?

Visit `/admin` to open the private owner form. The UI lets the owner publish a new property without touching Supabase directly.

Before using the page:

1. **Set an owner passcode** – add `VITE_ADMIN_PASSCODE=<secure value>` to your local `.env` file and deployment environment. The form requires this passcode before it will submit anything to Supabase.
2. **Grant Supabase insert access** – update your Row Level Security policies so the owner’s authenticated user (or a service role key used by your hosting provider) can `INSERT` into the `public.properties` table. If no policy allows inserts, Supabase will reject submissions from the admin form.

After configuring those two items, sign in as the owner, open `/admin`, complete the property details, and click **Publish listing**. The React app uses the same Supabase client as the public site, so the new record appears instantly on the home page.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/658e2726-9e13-4d9b-9343-0d9f77b2d9fd) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
