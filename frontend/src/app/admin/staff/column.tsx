
import { createColumnHelper } from "@tanstack/react-table";
import { Account } from "../../../../constants/sample-data";

const columnHelper = createColumnHelper<Account>();

export const helperColumns = [
    columnHelper.display({
        id: 'select',
        header: ({ table }) => (
            <input
                type="checkbox"
                checked={table.getIsAllRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
            />
        ),
        cell: ({ row }) => (
            <input
                type="checkbox"
                checked={row.getIsSelected()}
                onChange={row.getToggleSelectedHandler()}
            />
        ),
        size: 50
    }),
    columnHelper.accessor("name", {
        header: "FullName",
        cell: account => account.getValue(),
        size: 150,
    }),
    columnHelper.accessor("email", {
        header: "Email",
        cell: account => account.getValue(),
        size: 250,
    }),
    columnHelper.accessor("gender", {
        header: "Gender",
        cell: account => account.getValue(),
        size: 80,
    }),
    columnHelper.accessor("address", {
        header: "Address",
        cell: account => account.getValue(),
        size: 250,
    }),
    columnHelper.accessor("birthday", {
        header: "Birthday",
        cell: account => account.getValue(),
        size: 130,
    }),
    columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: row => (
            <div>
                <button onClick={() => console.log('Edit ')}>
                    Edit
                </button>
                <button
                    onClick={() => console.log('Delete')}
                    style={{ marginLeft: '8px', color: 'red' }}
                >
                    Delete
                </button>
            </div>
        ),
        size: 150,
    })
]