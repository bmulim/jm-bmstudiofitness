import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function InfoCard({ title, children, className = "" }: InfoCardProps) {
  return (
    <Card className={`border-[#C2A537]/50 bg-black/40 ${className}`}>
      <CardHeader>
        <CardTitle className="text-[#C2A537]">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );
}

interface InfoFieldProps {
  label: string;
  value: string | number;
  highlight?: boolean;
}

export function InfoField({ label, value, highlight = false }: InfoFieldProps) {
  return (
    <div>
      <p className="text-sm text-slate-400">{label}</p>
      <p
        className={`${highlight ? "font-semibold text-green-400" : "text-white"}`}
      >
        {value}
      </p>
    </div>
  );
}
