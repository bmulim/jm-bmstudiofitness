// Esta action foi descontinuada — agora utilizamos a rota API em
// src/app/api/admin/body-measurements/route.ts e as chamadas do cliente usam fetch.
export type SaveBodyMeasurementsData = Record<string, unknown>;

export async function saveBodyMeasurements(_data: SaveBodyMeasurementsData) {
  throw new Error(
    "saveBodyMeasurements action descontinuada. Use a rota API /api/admin/body-measurements",
  );
}
