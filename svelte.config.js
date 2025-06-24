import adapter from '@sveltejs/adapter-auto';
import vercel from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: vercel({
			runtime: 'nodejs20.x'
		}),
		alias: {
			$lib: './src/lib'
		}
	}
};

export default config;
