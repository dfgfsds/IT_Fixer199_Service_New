export const safeErrorLog = (message: string, error: any) => {
  const status = error?.response?.status;
  const errorMsg = error?.message || "";

  // Ignore common codes or handled business logic errors that shouldn't trigger Next.js dev overlays
  if (
    status === 401 || status === 400 || status === 422 || status === 404 || status === 500 ||
    errorMsg.includes('not available') || 
    errorMsg.includes('location')
  ) {
    console.warn(`[Silent Note] ${message}:`, errorMsg);
    return;
  }

  // Log other genuinely unexpected critical errors to console.error
  console.error(message, error);
};
