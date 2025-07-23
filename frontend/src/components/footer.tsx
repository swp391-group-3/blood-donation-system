import { Hexagon, Github, Twitter } from 'lucide-react';
import { Footer } from '@/components/ui/footer';
import { Logo } from '@/components/logo';

function Demo() {
    return (
        <div className="w-full">
            <Footer
                logo={<Logo />}
                socialLinks={[
                    {
                        icon: <Twitter className="h-5 w-5" />,
                        href: 'https://twitter.com',
                        label: 'Twitter',
                    },
                    {
                        icon: <Github className="h-5 w-5" />,
                        href: 'https://github.com',
                        label: 'GitHub',
                    },
                ]}
                mainLinks={[
                    { href: '/products', label: 'Products' },
                    { href: '/about', label: 'About' },
                    { href: '/blog', label: 'Blog' },
                    { href: '/contact', label: 'Contact' },
                ]}
                legalLinks={[
                    { href: '/privacy', label: 'Privacy' },
                    { href: '/terms', label: 'Terms' },
                ]}
                copyright={{
                    text: '© 2024 Awesome Corp',
                    license: 'All rights reserved',
                }}
            />
        </div>
    );
}

export { Demo };
