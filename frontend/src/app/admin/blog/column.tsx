import { Blog } from "@/lib/api/dto/blog";
import { createColumnHelper } from "@tanstack/react-table"
import { headers } from "next/headers";


const columnHelper = createColumnHelper<Blog>();

// export interface Blog {
//     id: string;
//     owner: string;
//     tags: string[];
//     title: string;
//     description: string;
//     content: string;
//     created_at: Date;
// }


export const columns = [
    columnHelper.accessor("title", {
        id: "Title",
        header: "Title",
        cell: ({ row }) => {
            const blog = row.original;
            return (
                <div>
                    <div className="text-sm text-gray-500">{blog.title}</div>
                </div>
            )
        }
    }),
    columnHelper.accessor("description", {
        id: "Description",
        header: "Description",
        cell: ({ row }) => {
            const blog = row.original;
            return (
                <div>
                    <div className="text-sm text-gray-500">{blog.description}</div>
                </div>
            )
        }
    }),
    columnHelper.accessor("owner", {
        id: "Owner",
        header: "Owner",
        cell: ({ row }) => {
            const blog = row.original;
            <div>
                <div className="text-sm text-gray-500">{blog.owner}</div>
            </div>
        }
    }),
    columnHelper.display({
        id: "Actions",
        header: "Actions",
        cell: ({ row }) => {
            const blog = row.original;
            return (
                <div>
                    Actions
                </div>
            )
        }
    })
]