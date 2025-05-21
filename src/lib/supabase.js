  // src/lib/supabase.ts
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { createClient } from '@supabase/supabase-js';

  const SUPABASE_URL = 'https://ldmoudiufdvpywrwcxat.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkbW91ZGl1ZmR2cHl3cndjeGF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NTgyOTUsImV4cCI6MjA2MzMzNDI5NX0.nrC8ZFjWu8DLW7Y1tvxCVaVslI2nHHKJ9FlHLdkN_Rk';

  export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });