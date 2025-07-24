'use client';

import { useState, useEffect, forwardRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import {
    Menu,
    ChevronDown,
    BookOpen,
    Zap,
    Palette,
    AlertCircle,
    Eye,
    BarChart3,
    FileText,
    Layers,
    HelpCircle,
    Database,
    CalendarCheck,
    Users2,
    LucideIcon,
    User,
    Droplets,
    Shield,
    Calendar,
    Home,
    LayoutDashboard,
    FileEdit,
    Activity,
    Package,
    BadgeQuestionMark,
    Droplet,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from './logo';
import { useCurrentAccount } from '@/hooks/use-current-account';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { AccountPicture } from './account-picture';
import { AccountOverview } from './account-overview';
import { Role } from '@/lib/api/dto/account';

const gettingStartedItems = [
    {
        title: 'Introduction',
        href: '/docs',
        description:
            'Re-usable components built using Radix UI and Tailwind CSS.',
        icon: BookOpen,
    },
    {
        title: 'Installation',
        href: '/docs/installation',
        description: 'How to install dependencies and structure your app.',
        icon: Zap,
    },
    {
        title: 'Typography',
        href: '/docs/primitives/typography',
        description: 'Styles for headings, paragraphs, lists and more.',
        icon: Palette,
    },
];

const components = [
    {
        title: 'Alert Dialog',
        href: '/docs/primitives/alert-dialog',
        description:
            'A modal dialog that interrupts the user with important content and expects a response.',
        icon: AlertCircle,
    },
    {
        title: 'Hover Card',
        href: '/docs/primitives/hover-card',
        description:
            'For sighted users to preview content available behind a link.',
        icon: Eye,
    },
    {
        title: 'Progress',
        href: '/docs/primitives/progress',
        description:
            'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
        icon: BarChart3,
    },
    {
        title: 'Scroll-area',
        href: '/docs/primitives/scroll-area',
        description: 'Visually or semantically separates content.',
        icon: FileText,
    },
    {
        title: 'Tabs',
        href: '/docs/primitives/tabs',
        description:
            'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
        icon: Layers,
    },
    {
        title: 'Tooltip',
        href: '/docs/primitives/tooltip',
        description:
            'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
        icon: HelpCircle,
    },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { data: currentAccount } = useCurrentAccount();
    const role = currentAccount?.role;

    type NavItem =
        | { label: string; href: string }
        | {
              label: string;
              children: {
                  label: string;
                  href: string;
                  icon?: LucideIcon;
                  description?: string;
              }[];
          };

    const guestAndDonorNav: NavItem[] = [
        { label: 'Home', href: '/' },
        { label: 'Blood Request', href: '/blood-request' },
        { label: 'Blog', href: '/blog' },
    ];

    const staffNav: NavItem[] = [
        ...guestAndDonorNav,
        {
            label: 'Management',
            children: [
                {
                    label: 'Question',
                    href: '/staff/questions',
                    icon: HelpCircle,
                    description: 'Manage FAQs and user inquiries',
                },
                {
                    label: 'Storage',
                    href: '/staff/storage',
                    icon: Database,
                    description: 'View and update blood stock',
                },
                {
                    label: 'Appointment',
                    href: '/staff/appointments',
                    icon: CalendarCheck,
                    description: 'Oversee scheduled appointments',
                },
            ],
        },
    ];

    const adminNav: NavItem[] = [
        { label: 'Home', href: '/' },
        { label: 'Dashboard', href: '/admin/dashboard' },
        {
            label: 'Management',
            children: [
                {
                    label: 'Blog Management',
                    href: '/admin/blogs',
                    icon: FileText,
                    description: 'Create and manage blog content',
                },
                {
                    label: 'Account Management',
                    href: '/admin/accounts',
                    icon: Users2,
                    description: 'Manage user and staff accounts',
                },
            ],
        },
    ];

    let navItems: NavItem[] = [];

    if (!role || role === 'donor') {
        navItems = staffNav;
    } else if (role === 'staff') {
        navItems = staffNav;
    } else if (role === 'admin') {
        navItems = adminNav;
    }

    interface NavigationItem {
        label: string;
        icon: LucideIcon;
        href: string;
    }

    const getNavigationItems = (role?: Role): NavigationItem[] => {
        switch (role) {
            case 'staff':
                return [
                    {
                        label: 'Home',
                        icon: Home,
                        href: '/',
                    },
                    {
                        label: 'Question',
                        icon: FileEdit,
                        href: 'question',
                    },
                    {
                        label: 'Request',
                        icon: Droplets,
                        href: '/request',
                    },
                    {
                        label: 'Appointment',
                        icon: Activity,
                        href: '/appointment/management',
                    },
                    {
                        label: 'Storage',
                        icon: Package,
                        href: '/blood-storage',
                    },
                    {
                        label: 'Blog',
                        icon: FileText,
                        href: '/blog',
                    },
                ];

            case 'admin':
                return [
                    {
                        label: 'Home',
                        icon: Home,
                        href: '/',
                    },
                    {
                        label: 'Dashboard',
                        icon: LayoutDashboard,
                        href: '/admin',
                    },
                    {
                        label: 'Account Management',
                        icon: User,
                        href: '/admin/account',
                    },
                    {
                        label: 'Blog Management',
                        icon: FileText,
                        href: '/admin/blog',
                    },
                ];

            default:
                return [
                    {
                        label: 'Home',
                        icon: Home,
                        href: '/',
                    },
                    {
                        label: 'Blood Request',
                        icon: Droplets,
                        href: '/request',
                    },
                    {
                        label: 'Blog',
                        icon: FileText,
                        href: '/blog',
                    },
                ];
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navbarHeight = isScrolled ? 'h-14' : 'h-16 sm:h-18 lg:h-20';

    return (
        <>
            <header
                className={cn(
                    'fixed top-0 w-full z-50 transition-all duration-500 ease-in-out',
                    isScrolled
                        ? 'bg-background/20 backdrop-blur-3xl border-b border-border/10 shadow-2xl'
                        : 'bg-transparent',
                )}
            >
                <div className="mx-auto max-w-7xl px-6">
                    <div
                        className={cn(
                            'flex items-center transition-all duration-300 ease-in-out',
                            navbarHeight,
                        )}
                    >
                        <div className="flex items-center space-x-2">
                            <Link
                                href="/"
                                className="flex items-center space-x-2"
                            >
                                <Logo />
                            </Link>
                        </div>

                        <div className="flex-1 flex justify-center mx-auto">
                            <NavigationMenu viewport={false}>
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <NavigationMenuLink
                                            asChild
                                            className={navigationMenuTriggerStyle()}
                                        >
                                            <Link href="/">Home</Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <NavigationMenuLink
                                            asChild
                                            className={navigationMenuTriggerStyle()}
                                        >
                                            <Link href="/request">
                                                Blood Request
                                            </Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <NavigationMenuLink
                                            asChild
                                            className={navigationMenuTriggerStyle()}
                                        >
                                            <Link href="/blog">Blog</Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger>
                                            Management
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid w-[300px] gap-4">
                                                <li>
                                                    <NavigationMenuLink
                                                        asChild
                                                        className="mb-4"
                                                    >
                                                        <Link
                                                            href="/question"
                                                            className="flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors duration-200"
                                                        >
                                                            <div className="flex items-start">
                                                                <div className="p-1.5 bg-green-50 rounded-lg mr-4">
                                                                    <BadgeQuestionMark className="h-4 w-4 text-green-600" />
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium text-slate-900">
                                                                        Questions
                                                                    </span>
                                                                    <div className="text-xs text-slate-500">
                                                                        Manage
                                                                        the
                                                                        question
                                                                        for
                                                                        blood
                                                                        request
                                                                        survey
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </NavigationMenuLink>
                                                    <NavigationMenuLink
                                                        asChild
                                                        className="mb-4"
                                                    >
                                                        <Link
                                                            href="/blood-storage"
                                                            className="flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors duration-200"
                                                        >
                                                            <div className="flex items-start">
                                                                <div className="p-1.5 bg-red-50 rounded-lg mr-4">
                                                                    <Droplet className="h-4 w-4 text-red-600" />
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium text-slate-900">
                                                                        Blood
                                                                        Storage
                                                                    </span>
                                                                    <div className="text-xs text-slate-500">
                                                                        Manage
                                                                        all
                                                                        blood
                                                                        bags
                                                                        exist in
                                                                        storage
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </NavigationMenuLink>
                                                    <NavigationMenuLink asChild>
                                                        <Link
                                                            href="/appointment"
                                                            className="flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors duration-200"
                                                        >
                                                            <div className="flex items-start">
                                                                <div className="p-1.5 bg-blue-50 rounded-lg mr-4">
                                                                    <Calendar className="h-4 w-4 text-blue-600" />
                                                                </div>
                                                                <div>
                                                                    <span className="font-medium text-slate-900">
                                                                        Appointment
                                                                    </span>
                                                                    <div className="text-xs text-slate-500">
                                                                        Manage
                                                                        all the
                                                                        appointment
                                                                        of blood
                                                                        requests
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </NavigationMenuLink>
                                                </li>
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>

                        <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
                            <Button
                                variant="ghost"
                                size={isScrolled ? 'sm' : 'default'}
                                className="hover:bg-accent/80 transition-all duration-300 font-medium"
                            >
                                Sign In
                            </Button>
                            <Button
                                size={isScrolled ? 'sm' : 'default'}
                                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                            >
                                Get Started
                            </Button>
                        </div>

                        {/* Enhanced Mobile Menu */}
                        <Sheet
                            open={isMobileMenuOpen}
                            onOpenChange={setIsMobileMenuOpen}
                        >
                            <SheetTrigger asChild className="md:hidden">
                                <Button
                                    variant="ghost"
                                    size={isScrolled ? 'sm' : 'icon'}
                                    className="transition-all duration-300 hover:bg-accent/80"
                                >
                                    <Menu
                                        className={cn(
                                            'transition-all duration-300',
                                            isScrolled ? 'h-4 w-4' : 'h-5 w-5',
                                        )}
                                    />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="right"
                                className="w-[350px] sm:w-[400px] p-0"
                            >
                                <div className="flex flex-col h-full">
                                    {/* Header */}
                                    <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-background to-accent/10">
                                        <div className="flex items-center space-x-3">
                                            <Logo />
                                        </div>
                                    </div>

                                    {/* Navigation Content */}
                                    <div className="flex-1 overflow-y-auto">
                                        <nav className="p-6 space-y-6">
                                            {/* Getting Started Section */}
                                            <div className="space-y-3">
                                                <details className="group">
                                                    <summary className="flex items-center justify-between cursor-pointer py-4 px-4 rounded-xl hover:bg-gradient-to-r hover:from-accent/50 hover:to-accent/30 transition-all duration-200 border border-transparent hover:border-border/50">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                                                                <BookOpen className="w-4 h-4 text-primary" />
                                                            </div>
                                                            <span className="font-semibold">
                                                                Getting started
                                                            </span>
                                                        </div>
                                                        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180 text-muted-foreground" />
                                                    </summary>
                                                    <div className="mt-3 space-y-2 pl-4">
                                                        {gettingStartedItems.map(
                                                            (item, index) => (
                                                                <Link
                                                                    key={
                                                                        item.title
                                                                    }
                                                                    href={
                                                                        item.href
                                                                    }
                                                                    className="flex items-center space-x-3 py-3 px-4 text-sm rounded-lg hover:bg-accent/60 transition-all duration-200 group animate-in fade-in slide-in-from-left-2"
                                                                    style={{
                                                                        animationDelay: `${index * 100}ms`,
                                                                    }}
                                                                    onClick={() =>
                                                                        setIsMobileMenuOpen(
                                                                            false,
                                                                        )
                                                                    }
                                                                >
                                                                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                                        <item.icon className="w-3 h-3 text-primary" />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                                                                            {
                                                                                item.title
                                                                            }
                                                                        </div>
                                                                        <div className="text-xs text-muted-foreground line-clamp-1">
                                                                            {
                                                                                item.description
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            ),
                                                        )}
                                                    </div>
                                                </details>

                                                {/* Components Section */}
                                                <details className="group">
                                                    <summary className="flex items-center justify-between cursor-pointer py-4 px-4 rounded-xl hover:bg-gradient-to-r hover:from-accent/50 hover:to-accent/30 transition-all duration-200 border border-transparent hover:border-border/50">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/40 to-accent/20 flex items-center justify-center">
                                                                <Layers className="w-4 h-4 text-accent-foreground" />
                                                            </div>
                                                            <span className="font-semibold">
                                                                Components
                                                            </span>
                                                        </div>
                                                        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180 text-muted-foreground" />
                                                    </summary>
                                                    <div className="mt-3 space-y-2 pl-4 max-h-64 overflow-y-auto">
                                                        {components.map(
                                                            (
                                                                component,
                                                                index,
                                                            ) => (
                                                                <Link
                                                                    key={
                                                                        component.title
                                                                    }
                                                                    href={
                                                                        component.href
                                                                    }
                                                                    className="flex items-center space-x-3 py-3 px-4 text-sm rounded-lg hover:bg-accent/60 transition-all duration-200 group animate-in fade-in slide-in-from-left-2"
                                                                    style={{
                                                                        animationDelay: `${index * 50}ms`,
                                                                    }}
                                                                    onClick={() =>
                                                                        setIsMobileMenuOpen(
                                                                            false,
                                                                        )
                                                                    }
                                                                >
                                                                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                                        <component.icon className="w-3 h-3 text-primary" />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                                                                            {
                                                                                component.title
                                                                            }
                                                                        </div>
                                                                        <div className="text-xs text-muted-foreground line-clamp-1">
                                                                            {
                                                                                component.description
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            ),
                                                        )}
                                                    </div>
                                                </details>

                                                {/* Direct Links */}
                                                <Link
                                                    href="/docs"
                                                    className="flex items-center space-x-3 py-4 px-4 font-semibold rounded-xl hover:bg-gradient-to-r hover:from-accent/50 hover:to-accent/30 transition-all duration-200 border border-transparent hover:border-border/50"
                                                    onClick={() =>
                                                        setIsMobileMenuOpen(
                                                            false,
                                                        )
                                                    }
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/10 flex items-center justify-center">
                                                        <FileText className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <span>Documentation</span>
                                                </Link>

                                                <Link
                                                    href="/pricing"
                                                    className="flex items-center space-x-3 py-4 px-4 font-semibold rounded-xl hover:bg-gradient-to-r hover:from-accent/50 hover:to-accent/30 transition-all duration-200 border border-transparent hover:border-border/50"
                                                    onClick={() =>
                                                        setIsMobileMenuOpen(
                                                            false,
                                                        )
                                                    }
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center">
                                                        <BarChart3 className="w-4 h-4 text-green-600" />
                                                    </div>
                                                    <span>Pricing</span>
                                                </Link>
                                            </div>
                                        </nav>
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="p-6 border-t bg-gradient-to-r from-background to-accent/5">
                                        <div className="flex flex-col space-y-3">
                                            <Button
                                                variant="ghost"
                                                className="justify-start font-medium hover:bg-accent/60 transition-all duration-200"
                                                onClick={() =>
                                                    setIsMobileMenuOpen(false)
                                                }
                                            >
                                                Sign In
                                            </Button>
                                            <Button
                                                className="justify-start bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                                                onClick={() =>
                                                    setIsMobileMenuOpen(false)
                                                }
                                            >
                                                Get Started
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>

            {/* Spacer to prevent content overlap */}
            <div
                className={cn(
                    'transition-all duration-300 ease-in-out',
                    navbarHeight,
                )}
            />
        </>
    );
}

const ListItem = forwardRef<
    React.ElementRef<'a'>,
    React.ComponentPropsWithoutRef<'a'> & {
        icon?: React.ComponentType<{ className?: string }>;
        delay?: number;
    }
>(({ className, title, children, icon: Icon, delay = 0, ...props }, ref) => {
    return (
        <div
            className="animate-in fade-in slide-in-from-left-2 duration-300"
            style={{ animationDelay: `${delay}ms` }}
        >
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        'group block select-none rounded-xl p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-accent/60 hover:shadow-md hover:scale-[1.02] focus:bg-accent focus:text-accent-foreground border border-transparent hover:border-border/50',
                        className,
                    )}
                    {...props}
                >
                    <div className="flex items-start space-x-3">
                        {Icon && (
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0 mt-0.5">
                                <Icon className="w-4 h-4 text-primary" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium leading-none mb-2 group-hover:text-primary transition-colors">
                                {title}
                            </div>
                            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors">
                                {children}
                            </p>
                        </div>
                    </div>
                </a>
            </NavigationMenuLink>
        </div>
    );
});
ListItem.displayName = 'ListItem';
