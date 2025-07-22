import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Props {
    name: string;
}

export const AccountPicture = ({ name }: Props) => {
    return (
        <Avatar className="rounded-lg size-full">
            <AvatarFallback className="bg-rose-400/20 text-rose-500 rounded font-medium">
                {name[0]}
            </AvatarFallback>
        </Avatar>
    );
};
