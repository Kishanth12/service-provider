import { Badge } from "@/components/ui/badge";
import { Role } from "@/types";
import { Shield, UserCheck, User } from "lucide-react";

export function RoleBadge({ role }: { role: Role }) {
  const roleStyles = {
    [Role.ADMIN]: {
      className:
        "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/20",
      icon: <Shield className="h-3.5 w-3.5" />,
    },
    [Role.PROVIDER]: {
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20",
      icon: <UserCheck className="h-3.5 w-3.5" />,
    },
    [Role.USER]: {
      className:
        "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20",
      icon: <User className="h-3.5 w-3.5" />,
    },
  };

  const current = roleStyles[role];

  return (
    <Badge
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${current.className}`}
    >
      {current.icon}
      {role}
    </Badge>
  );
}
