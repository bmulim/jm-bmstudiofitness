import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/db";
import { bodyMeasurementsTable } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const saveSchema = z.object({
  userId: z.string().uuid().optional(),
  weightKg: z.number().optional(),
  heightCm: z.number().optional(),
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
  measuredBy: z.string().uuid().optional(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = saveSchema.parse(json);

    // If no userId provided, we still allow insert but prefer userId
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const insertData: any = {
      userId: parsed.userId || null,
      weightKg: parsed.weightKg ?? null,
      heightCm: parsed.heightCm ?? null,
      chestCm: parsed.chestCm ?? null,
      waistCm: parsed.waistCm ?? null,
      abdomenCm: parsed.abdomenCm ?? null,
      hipCm: parsed.hipCm ?? null,
      rightArmCm: parsed.rightArmCm ?? null,
      leftArmCm: parsed.leftArmCm ?? null,
      rightThighCm: parsed.rightThighCm ?? null,
      leftThighCm: parsed.leftThighCm ?? null,
      rightCalfCm: parsed.rightCalfCm ?? null,
      leftCalfCm: parsed.leftCalfCm ?? null,
      bodyFatPercentage: parsed.bodyFatPercentage ?? null,
      tricepsSkinfoldMm: parsed.tricepsSkinfoldMm ?? null,
      subscapularSkinfoldMm: parsed.subscapularSkinfoldMm ?? null,
      chestSkinfoldMm: parsed.chestSkinfoldMm ?? null,
      axillarySkinfoldMm: parsed.axillarySkinfoldMm ?? null,
      suprailiacSkinfoldMm: parsed.suprailiacSkinfoldMm ?? null,
      abdominalSkinfoldMm: parsed.abdominalSkinfoldMm ?? null,
      thighSkinfoldMm: parsed.thighSkinfoldMm ?? null,
      measuredBy: parsed.measuredBy ?? null,
      notes: parsed.notes ?? null,
    };

    await db.insert(bodyMeasurementsTable).values(insertData);

    // revalidate admin students list page cache if needed
    try {
      revalidatePath("/admin/students");
    } catch {
      // ignore when running in environments without ISR
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] Error saving body measurement:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId is required" }, { status: 400 });
    }

    const measurements = await db
      .select()
      .from(bodyMeasurementsTable)
      .where(eq(bodyMeasurementsTable.userId, userId))
      .orderBy(desc(bodyMeasurementsTable.createdAt));

    return NextResponse.json({ success: true, measurements });
  } catch (error) {
    console.error("[API] Error fetching body measurements:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
