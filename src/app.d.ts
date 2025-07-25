/// <reference types="@sveltejs/kit" />

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: import('@supabase/supabase-js').SupabaseClient<import('@supabase/supabase-js').Database>
			getUser(): Promise<import('@supabase/supabase-js').User | null>
		}
		interface PageData {
			session: import('@supabase/supabase-js').Session | null
		}
		// interface PageState {}
		// interface Platform {}
	}
	namespace NodeJS {
		interface ProcessEnv {
			PUBLIC_SUPABASE_URL: string;
			PUBLIC_SUPABASE_ANON_KEY: string;
			ANTHROPIC_API_KEY: string;
			VERTEX_PROJECT_ID: string;
		}
	}
}

export {};
