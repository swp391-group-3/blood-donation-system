import { Account } from '@/lib/api/dto/account';
import { AccountPicture } from '@/components/account-picture';

export const AccountOverview = ({ account }: { account: Account }) => {
    return (
        <div className="flex items-center gap-3">
            <div className="size-10">
                <AccountPicture name={account.name} />
            </div>
            <div>
                <div className="font-semibold text-slate-900 text-sm">
                    {account.name}
                </div>
                <div className="text-xs text-slate-500">{account.email}</div>
            </div>
        </div>
    );
};
