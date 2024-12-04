'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { PROFILE_ROUTE, ROOT_ROUTE, SESSION_COOKIE_NAME } from '@/constants';
import { signOutWithGoogle } from '@/libs/firebase/auth';

export async function createSession(uid: string) {
  (await cookies()).set(SESSION_COOKIE_NAME, uid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // One day
    path: '/',
  });

  redirect(PROFILE_ROUTE);
}

export async function removeSession() {
  signOutWithGoogle();
  (await cookies()).delete(SESSION_COOKIE_NAME);
  redirect(ROOT_ROUTE);
}