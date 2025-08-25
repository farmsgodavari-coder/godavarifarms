// Ensures environment flags are logged once per server startup
// Next.js loads .env.local automatically in development.
// We log in non-production and only once using a global guard.

declare global {
  // eslint-disable-next-line no-var
  var __onion_bootstrapped: boolean | undefined;
}

if (!global.__onion_bootstrapped) {
  global.__onion_bootstrapped = true;
  const simple = String(process.env.ADMIN_SIMPLE_AUTH || "").toLowerCase().trim();
  const disabled = String(process.env.ADMIN_AUTH_DISABLED || "").toLowerCase().trim();
  const env = process.env.NODE_ENV;
  // Log always on server start for visibility
  // These logs help verify .env.local is being read correctly
  // Example expected: { NODE_ENV: 'development', ADMIN_SIMPLE_AUTH: 'true', ADMIN_AUTH_DISABLED: 'false' }
  // Do not log secrets
  console.log("[Onion Admin] Env flags", {
    NODE_ENV: env,
    ADMIN_SIMPLE_AUTH: simple,
    ADMIN_AUTH_DISABLED: disabled,
  });

  if (disabled === "true" && simple === "true") {
    console.warn("[Onion Admin] Both ADMIN_AUTH_DISABLED and ADMIN_SIMPLE_AUTH are true. 'Disabled' bypass will take precedence in middleware.");
  }
}

export {};
