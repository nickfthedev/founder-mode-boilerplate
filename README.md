# NextJS Boilerplate
If you want to contribute, feel free to do so!

## Features

- Authentication
- Database
- Email
- Payment
- Contact Form
- Newsletter
- Blog
- Cookie Banner
- Pages
- Sidebar-Layout
- Dark-/Lightmode
- Users with Profiles
- Allow Users to Post Blogposts
- Configurable via app.config.ts

## How to use

- Clone the repo
- Add your own env variables
- Run `yarn` to install the dependencies
- Run `docker compose up -d postgres` to start the database
- Run `yarn db:migrate` to migrate the database
- Run `yarn dev` to start the development server

# Stripe Webhooks

- You can run `docker compose up stripecli` to start the stripe cli
- Check the logs with `docker compose logs -f stripecli` (only if you run it for the first time & in detached mode)
- Follow the login instructions from the logs
- Re-run `docker compose up stripecli` to restart the stripe cli
- Copy webhook secret from the logs into the .env file
- Run `docker compose up -d stripecli` to start the stripe cli in detached mode to run it in the background
- Test your webhook

## Check out the original T3 Readme and follow the docs if you want to learn more

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
