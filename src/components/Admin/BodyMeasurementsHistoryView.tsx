import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BodyMeasurementsHistoryViewProps {
  userId: string;
}

type DbMeasurement = {
  id: string;
  userId: string;
  weightKg: string;
  heightCm: string;
  chestCm: string | null;
  waistCm: string | null;
  abdomenCm: string | null;
  hipCm: string | null;
  rightArmCm: string | null;
  leftArmCm: string | null;
  rightThighCm: string | null;
  leftThighCm: string | null;
  rightCalfCm: string | null;
  leftCalfCm: string | null;
  bodyFatPercentage: string | null;
  tricepsSkinfoldMm: string | null;
  subscapularSkinfoldMm: string | null;
  chestSkinfoldMm: string | null;
  axillarySkinfoldMm: string | null;
  suprailiacSkinfoldMm: string | null;
  abdominalSkinfoldMm: string | null;
  thighSkinfoldMm: string | null;
  createdAt: string;
  measuredBy: string | null;
  notes: string | null;
}

export function BodyMeasurementsHistoryView({ userId }: BodyMeasurementsHistoryViewProps) {
  const [measurements, setMeasurements] = useState<DbMeasurement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMeasurements() {
      try {
        if (!userId) {
          setMeasurements([]);
          return;
        }

        const res = await fetch(`/api/admin/body-measurements?userId=${encodeURIComponent(userId)}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.measurements)) {
          setMeasurements(json.measurements as DbMeasurement[]);
        } else {
          setMeasurements([]);
        }
      } catch (error) {
        console.error("Error loading measurements:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMeasurements();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C2A537] border-t-transparent" />
      </div>
    );
  }

  if (measurements.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-slate-400">Nenhuma medição registrada ainda</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#C2A537]">Histórico de Medições</h3>
      <div className="rounded-lg border border-slate-700 bg-slate-800/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Peso (kg)</TableHead>
              <TableHead>Altura (cm)</TableHead>
              <TableHead>% Gordura</TableHead>
              <TableHead>IMC</TableHead>
              <TableHead>Observações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {measurements.map((measurement) => {
              const date = new Date(measurement.createdAt);
              const weightKg = parseFloat(measurement.weightKg);
              const heightCm = parseFloat(measurement.heightCm);
              const imc = weightKg / Math.pow(heightCm / 100, 2);
              const bodyFatPercentage = measurement.bodyFatPercentage ? parseFloat(measurement.bodyFatPercentage) : null;

              return (
                <TableRow key={measurement.id}>
                  <TableCell>
                    {date.toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>{weightKg.toFixed(1)}</TableCell>
                  <TableCell>{heightCm.toFixed(1)}</TableCell>
                  <TableCell>
                    {bodyFatPercentage !== null ? `${bodyFatPercentage.toFixed(1)}%` : "-"}
                  </TableCell>
                  <TableCell>{imc.toFixed(1)}</TableCell>
                  <TableCell>{measurement.notes || "-"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}