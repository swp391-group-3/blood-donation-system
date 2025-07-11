"use client"
import { FormEdit } from "@/components/edit-profile";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Blog } from "@/lib/api/dto/blog";
import { createColumnHelper } from "@tanstack/react-table"
import { Edit3, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";


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
            return (
                <div>
                    <div className="text-sm text-gray-500">{blog.owner}</div>
                </div>
            )
        }
    }),
    columnHelper.display({
        id: "Actions",
        header: "Actions",
        cell: ({ row }) => {
            const blog = row.original;
            return (
                <div>
                    <BlogActionsCell blog={blog} />
                </div>
            )
        }
    })
]

function BlogActionsCell({ blog }: { blog: Blog }) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    // const { mutation, form } = useUpdateDataTable(blog.id, blog, {
    //     onSuccess() {
    //         setIsEditModalOpen(false);
    //     },
    // });
    // const deleteMutation = useDeleteAccount();
    // const handleDeleteAccount = (id: string) => {
    //     deleteMutation.mutate(id);
    // };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                side="bottom"
                sideOffset={8}
                alignOffset={4}
            >
                {/* EDIT */}
                <DropdownMenuItem
                    onSelect={() => {
                        setIsEditModalOpen(true);
                    }}
                >
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit Blog
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {/* DELETE */}
                <DropdownMenuItem
                    // onSelect={() => {
                    //     handleDeleteAccount(account.id);
                    // }}
                    className="text-red-600"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Blog
                </DropdownMenuItem>
            </DropdownMenuContent>

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Edit Blog</DialogTitle>
                    </DialogHeader>
                    <div className="overflow-y-auto flex-1 pr-2">
                        {/* <FormEdit 
                        form={form} 
                        mutation={mutation}
                         /> */}
                    </div>
                </DialogContent>
            </Dialog>
        </DropdownMenu>
    )
}
