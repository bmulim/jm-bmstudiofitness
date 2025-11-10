import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "@/db";
import { bodyMeasurementsTable } from "@/db/schema";

const saveBodyMeasurementsSchema = z.object({
  userId: z.string(),
  weightKg: z.number(),
  heightCm: z.number(),
  chestCm: z.number().optional(),
  waistCm: z.number().optional(),
  abdomenCm: z.number().optional(),
  hipCm: z.number().optional(),
  rightArmCm: z.number().optional(),
  leftArmCm: z.number().optional(),
  rightThighCm: z.number().optional(),
  leftThighCm: z.number().optional(),
  rightCalfCm: z.number().optional(),
  leftCalfCm: z.number().optional(),
  bodyFatPercentage: z.number().optional(),
  tricepsSkinfoldMm: z.number().optional(),
  subscapularSkinfoldMm: z.number().optional(),
  chestSkinfoldMm: z.number().optional(),
  axillarySkinfoldMm: z.number().optional(),
  suprailiacSkinfoldMm: z.number().optional(),
  abdominalSkinfoldMm: z.number().optional(),
  thighSkinfoldMm: z.number().optional(),
  notes: z.string().optional(),
  measuredBy: z.string(),
});

export type SaveBodyMeasurementsData = z.infer<typeof saveBodyMeasurementsSchema>;

export async function saveBodyMeasurements(data: SaveBodyMeasurementsData) {
  const validatedData = saveBodyMeasurementsSchema.parse(data);

  try {
    await db.insert(bodyMeasurementsTable).values({
      userId: validatedData.userId,
      weightKg: validatedData.weightKg,
      heightCm: validatedData.heightCm,
      chestCm: validatedData.chestCm,
      waistCm: validatedData.waistCm,
      abdomenCm: validatedData.abdomenCm,
      hipCm: validatedData.hipCm,
      rightArmCm: validatedData.rightArmCm,
      leftArmCm: validatedData.leftArmCm,
      rightThighCm: validatedData.rightThighCm,
      leftThighCm: validatedData.leftThighCm,
      rightCalfCm: validatedData.rightCalfCm,
      leftCalfCm: validatedData.leftCalfCm,
      bodyFatPercentage: validatedData.bodyFatPercentage,
      tricepsSkinfoldMm: validatedData.tricepsSkinfoldMm,
      subscapularSkinfoldMm: validatedData.subscapularSkinfoldMm,
      chestSkinfoldMm: validatedData.chestSkinfoldMm,
      axillarySkinfoldMm: validatedData.axillarySkinfoldMm,
      suprailiacSkinfoldMm: validatedData.suprailiacSkinfoldMm,
      abdominalSkinfoldMm: validatedData.abdominalSkinfoldMm,
      thighSkinfoldMm: validatedData.thighSkinfoldMm,
      notes: validatedData.notes,
      measuredBy: validatedData.measuredBy,
    });

    revalidatePath("/admin/students");
    return { success: true };
  } catch (error) {
    console.error("Error saving body measurements:", error);
    return { success: false, error: "Erro ao salvar as medições corporais" };
  }
}