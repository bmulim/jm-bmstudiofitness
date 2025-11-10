import { db } from "@/db";
import { bodyMeasurementsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getBodyMeasurementsHistoryAction(userId: string) {
  try {
    const measurements = await db
      .select()
      .from(bodyMeasurementsTable)
      .where(eq(bodyMeasurementsTable.userId, userId))
      .orderBy(bodyMeasurementsTable.createdAt);

    return { success: true, measurements };
  } catch (error) {
    console.error("Error fetching body measurements history:", error);
    return { success: false, error: "Erro ao buscar histórico de medições" };
  }
}