import { createColumnHelper } from "@tanstack/react-table";
import { Account } from "./page";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Crown, Edit, MoreHorizontal, Shield, Trash2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";


const columnHelper = createColumnHelper<Account>();


const getRoleIcon = (role: string) => {
    switch (role) {
        case "ADMIN":
            return <Crown className="h-4 w-4" />
        case "STAFF":
            return <Shield className="h-4 w-4" />
        default:
            return <Users className="h-4 w-4" />
    }
}
const getStatusBadge = (status: string) => {
    switch (status) {
        case "ACTIVE":
            return (
                <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                    Active
                </Badge>
            )
        case "INACTIVE":
            return <Badge variant="destructive">Inactive</Badge>
        default:
            return <Badge variant="outline">{status}</Badge>
    }
}

export const columns = useMemo(() => {
    return [
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
}, [])

