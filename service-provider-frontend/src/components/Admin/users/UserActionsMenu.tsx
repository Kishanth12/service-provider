import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/types";
import { Edit, Eye, MoreVertical, Trash2 } from "lucide-react";

export function UserActionsMenu({
  user,
  onView,
  onEdit,
  onDelete,
}: {
  user: User;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 rounded-xl p-0 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-44 rounded-xl border border-slate-200/70 bg-white/80 backdrop-blur-xl shadow-xl p-1 dark:bg-slate-900/80 dark:border-slate-800"
      >
        <DropdownMenuItem
          onClick={() => onView(user)}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer transition hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/30"
        >
          <Eye className="h-4 w-4" />
          View Details
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onEdit(user)}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer transition hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900/30"
        >
          <Edit className="h-4 w-4" />
          Edit User
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onDelete(user)}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer transition hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/30"
        >
          <Trash2 className="h-4 w-4" />
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
