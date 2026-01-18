import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';

export const dynamic = 'force-dynamic';

export async function GET() {
  const status = {
    env: {
      MONGODB_URI: process.env.MONGODB_URI ? 'Defined (Starts with: ' + process.env.MONGODB_URI.substring(0, 10) + '...)' : 'MISSING ❌',
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'Defined' : 'MISSING ❌',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'Defined' : 'MISSING ❌',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Defined' : 'MISSING ❌ (Required for production)',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Not set (Vercel automatic)',
      NODE_ENV: process.env.NODE_ENV,
    },
    dbConnection: 'Pending...',
  };

  try {
    await dbConnect();
    status.dbConnection = 'SUCCESS ✅: Connected to MongoDB';
  } catch (error) {
    status.dbConnection = `FAILED ❌: ${(error as Error).message}`;
  }

  return NextResponse.json(status, { status: 200 });
}
