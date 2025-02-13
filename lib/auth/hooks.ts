"use client";

import { useAuth as useAuthContext } from './context';

export function useAuth() {
  return useAuthContext();
}

export { useAuth }