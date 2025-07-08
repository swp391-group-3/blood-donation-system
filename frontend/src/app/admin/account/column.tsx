import { createColumnHelper } from "@tanstack/react-table";
import { Account } from "@/lib/api/dto/account";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Crown, Edit, MoreHorizontal, Shield, Trash2, Users } from "lucide-react";


const columnHelper = createColumnHelper<Account>();


const getRoleIcon = (role: string) => {
    switch (role) {
        case "admin":
            return <Crown className="h-4 w-4 text-amber-500" />
        case "staff":
            return <Shield className="h-4 w-4 text-fuchsia-500" />
        default:
            return <Users className="h-4 w-4 text-emerald-500" />
    }
}

export const columns = [
    columnHelper.display({
        id: "Select",
        header: ({ table }) => (
            <input
                type="checkbox"
                checked={table.getIsAllRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
            />
        ),
        cell: ({ row }) => {
            return (
                <input
                    type="checkbox"
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                />
            )
        }
    }),
    columnHelper.accessor(
        row => `${row.name} | ${row.email}`,
        {
            id: "Name",
            header: "Name & Email",
            cell: info => {
                const rowData = info.row.original;
                return (
                    <div className="w-2xs">
                        <div className="font-medium">{rowData.name}</div>
                        <div className="text-sm text-gray-500">{rowData.email}</div>
                    </div>
                );
            }
        }
    )
    ,
    columnHelper.accessor("role", {
        id: "Role",
        header: "Role",
        cell: account =>
        (
            <span className="flex items-center gap-1">
                {getRoleIcon(account.getValue())} {account.getValue()}
            </span>
        )
    }),
    columnHelper.accessor("created_at", {
        id: "Create At",
        header: "Created At",
        cell: account => {
            const date: Date = new Date(account.getValue());
            return <span>
                {date.toLocaleDateString()}
            </span>
        }
    }),
    columnHelper.display({
        id: "Actions",
        header: "Actions",
        cell() {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" side="bottom" sideOffset={8} alignOffset={4}>
                        <DropdownMenuItem
                        // onClick={() => setEditingUser(user)}
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600"
                        // onClick={() => handleDeleteUser(user.id)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    })
];


