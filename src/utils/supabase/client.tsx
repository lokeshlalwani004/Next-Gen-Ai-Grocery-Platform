import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Create a singleton Supabase client for the browser
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);
