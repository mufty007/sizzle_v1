import { NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validation/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);
    
    // Implement your own auth logic here
    // This is just a placeholder
    const mockUser = {
      id: '1',
      email: validatedData.email,
      username: validatedData.email.split('@')[0],
    };

    return NextResponse.json({
      user: mockUser,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }
}