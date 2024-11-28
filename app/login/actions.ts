'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export async function login(data: { email: string; password: string; }, redirectTo: string = '/') {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect('/error');
  }

  redirect(redirectTo);
}

export async function signup(data: { email: string; password: string; }, redirectTo: string = '/') {
  const supabase = createClient();

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect('/error');
  }

  redirect(redirectTo);
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    redirect('/error');
  }
  redirect('/');
}

export async function getSession() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();
  console.error(error);
  return data;
}
