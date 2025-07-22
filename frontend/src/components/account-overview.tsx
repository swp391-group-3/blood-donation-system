import { AccountPicture } from '@/components/account-picture';

interface Props {
    email: string;
    name: string;
}

export const AccountOverview = ({ email, name }: Props) => {
    return (
        <div className="flex items-center gap-3">
            <div className="size-10">
                <AccountPicture name={name} />
            </div>
            <div>
                <div className="font-semibold text-slate-900 text-sm">
                    {name}
                </div>
                <div className="text-xs text-slate-500">{email}</div>
            </div>
        </div>
    );
};
