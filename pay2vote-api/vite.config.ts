/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
});

// setupFiles: './src/setupTests.ts',
// coverage: {
//   reporter: ['text', 'html'],
//   exclude: [
//     'node_modules/',
//     'src/setupTests.ts',
//   ],
// },
