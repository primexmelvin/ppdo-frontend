# PPDO

Provincial Planning and Development Office - Document Management System

This is a [Next.js](https://nextjs.org) project built for managing documents, communications, and administrative workflows for the Provincial Planning and Development Office.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB instance (local or MongoDB Atlas)

### Environment Setup

1. Create a `.env.local` file in the root directory:

```bash
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority

# Database Name (optional, defaults to 'ppdo')
MONGODB_DB=ppdo

# HRMO External API URL (for HRMO office data)
NEXT_PUBLIC_HRMO_API_URL=https://hrmo-tarlac.netlify.app

# OpenAI API Key (for AI Assistant)
OPENAI_API_KEY=your_openai_api_key_here
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### MongoDB Connection

The project uses MongoDB for data persistence. The connection is configured in `lib/mongodb.ts` following Next.js best practices for serverless environments.

**Test your connection:**

- Visit `http://localhost:3000/api/test-db` to verify MongoDB connectivity
- This endpoint will list all collections in your database

**Using MongoDB Atlas:**

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string from the Atlas dashboard
3. Replace `MONGODB_URI` in `.env.local` with your Atlas connection string
4. Ensure your IP is whitelisted in Atlas network settings

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
