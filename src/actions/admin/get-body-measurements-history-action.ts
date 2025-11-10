// Esta action foi descontinuada — o cliente agora consome a API em
// src/app/api/admin/body-measurements/route.ts via fetch.

export async function getBodyMeasurementsHistoryAction() {
  // Intencionalmente vazio: usar a rota API via fetch
  throw new Error(
    "getBodyMeasurementsHistoryAction descontinuada. Use a GET em /api/admin/body-measurements?userId=...",
  );
}
