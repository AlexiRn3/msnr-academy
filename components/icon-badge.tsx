import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconBadgeProps {
  icon: LucideIcon;
};

export const IconBadge = ({
  icon: Icon,
}: IconBadgeProps) => {
  return (
    <div className="p-2 rounded-md bg-sky-100">
      <Icon className="h-8 w-8 text-sky-700" />
    </div>
  );
};