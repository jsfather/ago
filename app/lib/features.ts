// Public flags are evaluated at build time. Only an explicit false opts out.
export const SERVICE_FINISHED =
  process.env.NEXT_PUBLIC_SERVICE_FINISHED !== 'false';
