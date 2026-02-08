import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://ylabytibfldhcbxqvial.supabase.co"
const supabaseAnonKey = "sb_publishable_jVVl8OQ3HwL_QWCH0Fve8Q_y041GTKH"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
