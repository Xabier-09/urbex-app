const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabaseClient = createClient(supabaseUrl, supabaseKey);

const connectSupabase = async () => {
  try {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) {
      throw error;
    }
    console.log('✅ Supabase connected successfully');
    return supabaseClient;
  } catch (error) {
    console.error('❌ Failed to connect to Supabase:', error);
    throw error;
  }
};

module.exports = { supabaseClient, connectSupabase };
