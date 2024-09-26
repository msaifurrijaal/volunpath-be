import { createClient } from '@supabase/supabase-js';
import config from '../config';

const supabaseConnection = async () => {
  console.log('Connecting to Supabase...');
  const {
    supabase: { url, key },
  } = config;

  const supabaseClient = createClient(url, key);

  console.log('Connected to Supabase');
  return supabaseClient;
};

export default supabaseConnection;
