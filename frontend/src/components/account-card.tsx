import { Account } from '@/lib/api/dto/account';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplets, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from './ui/badge';
import { bloodGroupLabels } from '@/lib/api/dto/blood-group';

export const AccountCard = ({ account }: { account: Account }) => {
    return (
        <Card>
            <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-600" />
                    <span>Patient Information</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <User className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">
                        {account.name}
                    </h3>
                    <p className="text-sm text-gray-500">{account.email}</p>
                </div>

                <Separator />

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                            Blood Type
                        </span>
                        <Badge
                            variant="outline"
                            className="text-red-600 border-red-200"
                        >
                            <Droplets className="h-3 w-3 mr-1" />
                            {bloodGroupLabels[account.blood_group]}
                        </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Age</span>
                        <span className="text-sm font-medium">
                            {new Date().getFullYear() -
                                Number(account.birthday.substring(0, 4))}{' '}
                            years
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Gender</span>
                        <span className="text-sm font-medium capitalize">
                            {account.gender}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
