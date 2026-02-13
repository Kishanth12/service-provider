import { Badge } from "@/components/ui/badge";
import { Role } from "@/types";

export function RoleBadge({ role }: { role: Role }) {
  const variants = {
    [Role.ADMIN]: "bg-purple-100 text-purple-800",
    [Role.PROVIDER]: "bg-green-100 text-green-800",
    [Role.USER]: "bg-blue-100 text-blue-800",
  };

  return <Badge className={variants[role]}>{role}</Badge>;
}
