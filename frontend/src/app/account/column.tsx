import { createColumnHelper } from "@tanstack/react-table";
import { Account } from "./page";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";


const columnHelper = createColumnHelper<Account>();

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
                    <div>
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
        cell: account => {
            return account.getValue()
        }
    }),
    columnHelper.accessor("status", {
        id: "Status",
        header: "Status",
        cell: account => account.getValue()
    }),
    columnHelper.accessor("created_at", {
        id: "Create At",
        header: "Created At",
        cell: account => account.getValue()
    }),
    columnHelper.display({
        id: "Actions",
        header: "ACtions",
        cell({ row }) {
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

