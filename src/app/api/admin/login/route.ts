import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const response = NextResponse.json({ success: true });

    // 🔐 Set secure cookie
    response.cookies.set('admin-auth', 'true', {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
    });

    return response;
  }

  return NextResponse.json(
    { error: 'Invalid credentials' },
    { status: 401 }
  );
}