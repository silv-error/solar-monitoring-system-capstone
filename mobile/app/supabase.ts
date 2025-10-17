
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ltkgimzxkrtanqbbtphr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0a2dpbXp4a3J0YW5xYmJ0cGhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTA1NDgsImV4cCI6MjA3NjIyNjU0OH0.tyCMTqo82QTSmsWmNmVEJxjRUan8nzPPXFjI8BDN_SI'


export const supabase = createClient(supabaseUrl, supabaseAnonKey)


export default supabase