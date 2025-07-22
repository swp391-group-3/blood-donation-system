import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import Image from 'next/image';
import { oauth2 } from '@/lib/service/auth';

export const OAuth2 = () => {
    return (
        <div className="grid gap-5">
            <Button
                variant="outline"
                className="w-full py-5"
                onClick={() => oauth2('google')}
            >
                <FcGoogle className="h-10 w-10" />
                <span className="ml-2">Continue with Google</span>
            </Button>
            <Button
                variant="outline"
                className="w-full py-5"
                onClick={() => oauth2('microsoft')}
            >
                <Image
                    src="/microsoft.svg"
                    alt="microsoft"
                    width={20}
                    height={20}
                />
                <span className="ml-2">Continue with Microsoft</span>
            </Button>
        </div>
    );
};
