
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://iuttvwiktjqmqzfnnekc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1dHR2d2lrdGpxbXF6Zm5uZWtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1MTU3NTcsImV4cCI6MjA1NzA5MTc1N30.P5jTfiwMp_WWam-3ush8GcmO2vOjCkU2SSZLipNaGwM";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
