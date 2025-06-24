import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals: { getUser, supabase } }) => {
  const user = await getUser();
  const { data: { session }} = await supabase.auth.getSession();
  
  return {
    user,
    session,
  }
} 