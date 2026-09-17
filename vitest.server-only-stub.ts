// Vitest doesn't do Next.js's client/server module-graph split, so a
// Client Component that transitively imports a "use server" action file
// (which imports the DB layer) would otherwise hit the real `server-only`
// package and throw. Aliased in for every test via vitest.config.ts,
// mirroring how Next.js's bundler treats `server-only` as a no-op outside
// of an actual client bundle.
export {};
