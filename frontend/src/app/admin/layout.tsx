'use client';

import { WithRole } from '@/components/with-role';

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <WithRole roles={['admin']}>{children}</WithRole>;
}
