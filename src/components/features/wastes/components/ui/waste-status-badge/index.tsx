import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, Calendar as CalendarIcon } from "lucide-react";

interface WasteStatusBadgeProps {
  discardDate: string;
}

export function WasteStatusBadge({ discardDate }: WasteStatusBadgeProps) {
  const now = new Date();
  const discardDateTime = new Date(discardDate);
  
  const isPast = discardDateTime < now;
  const isToday = discardDateTime.toDateString() === now.toDateString();
  const isWithinWeek = discardDateTime.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000;

  if (isPast) {
    return (
      <Badge className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
        <CheckCircle className="h-2.5 w-2.5" />
        Concluído
      </Badge>
    );
  }

  if (isToday) {
    return (
      <Badge className="flex items-center gap-0.5 animate-pulse text-[10px] px-1.5 py-0.5 bg-red-100 text-red-800 border-red-200 hover:bg-red-100">
        <Clock className="h-2.5 w-2.5" />
        Hoje
      </Badge>
    );
  }

  if (isWithinWeek) {
    return (
      <Badge className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100">
        <CalendarIcon className="h-2.5 w-2.5" />
        Esta Semana
      </Badge>
    );
  }

  return (
    <Badge className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">
      <CalendarIcon className="h-2.5 w-2.5" />
      Agendado
    </Badge>
  );
}
