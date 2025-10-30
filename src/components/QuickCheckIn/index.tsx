"use client";

import { Clock, Loader2, UserCheck } from "lucide-react";
import { useActionState } from "react";

import { quickCheckInAction } from "@/actions/user/quick-check-in-action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface QuickCheckInState {
  success: boolean;
  message: string;
  userName?: string;
}

const initialState: QuickCheckInState = {
  success: false,
  message: "",
};

export default function QuickCheckInCard() {
  const [state, formAction, isPending] = useActionState(
    quickCheckInAction,
    initialState,
  );

  return (
    <Card className="w-[350px] max-w-md border-[#C2A537] bg-black/95 backdrop-blur-sm md:max-w-lg lg:max-w-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-[#C2A537] md:text-xl">
          <UserCheck className="h-5 w-5" />
          Check-in Rápido
        </CardTitle>
        <CardDescription className="text-xs text-slate-300 md:text-sm">
          Digite seu CPF ou email para registrar sua presença
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state.message && (
          <div
            className={`mb-4 rounded-md p-3 text-sm ${
              state.success
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {state.message}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="identifier" className="text-[#C2A537]">
              CPF ou Email
            </Label>
            <Input
              id="identifier"
              name="identifier"
              type="text"
              placeholder="123.456.789-00 ou seu@email.com"
              required
              disabled={isPending}
              className="bg-slate-900/50 text-white placeholder:text-slate-500"
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#C2A537] text-black hover:bg-[#D4B547]"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Fazendo Check-in...
              </>
            ) : (
              <>
                <Clock className="mr-2 h-4 w-4" />
                Fazer Check-in
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="text-xs text-slate-400">
              O check-in registra sua presença na academia hoje
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
