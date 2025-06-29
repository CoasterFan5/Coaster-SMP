import esbuild from "esbuild";

await esbuild.build({
	entryPoints: ["./index.ts"],
	bundle: true,
	minify: false,
	outdir: "./dist",
	platform: "node",
	format: "esm",
	target: "esnext",
	banner: {
		js: 'import { createRequire } from "module";const require = createRequire(import.meta.url);',
	},
});
