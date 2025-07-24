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
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            <Link
                                href="/"
                                className="flex items-center space-x-2"
                            >
                                <div
                                    className={cn(
                                        'rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center transition-all duration-300 shadow-lg',
                                        isScrolled
                                            ? 'h-7 w-7'
                                            : 'h-8 w-8 sm:h-9 sm:w-9',
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'text-primary-foreground font-bold transition-all duration-300',
                                            isScrolled ? 'text-xs' : 'text-sm',
                                        )}
                                    >
                                        L
                                    </span>
                                </div>
                                <span
                                    className={cn(
                                        'font-bold transition-all duration-300 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent',
                                        isScrolled
                                            ? 'text-lg'
                                            : 'text-xl sm:text-2xl',
                                    )}
                                >
                                    Logo
                                </span>
                            </Link>
                        </div>

                        {/* Centered Desktop Navigation */}
                        <div className="flex-1 flex justify-center mx-auto">
                            <NavigationMenu className="hidden md:flex">
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className="bg-transparent hover:bg-accent/80 data-[state=open]:bg-accent/80 transition-all duration-200 font-medium">
                                            Getting started
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <div className="w-[500px] p-6">
                                                <div className="mb-6">
                                                    <div className="flex items-center space-x-3 mb-3">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                                                            <BookOpen className="w-5 h-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                                                Get Started
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                Everything you
                                                                need to begin
                                                                building
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid gap-3">
                                                    {gettingStartedItems.map(
                                                        (item, index) => (
                                                            <ListItem
                                                                key={item.title}
                                                                title={
                                                                    item.title
                                                                }
                                                                href={item.href}
                                                                icon={item.icon}
                                                                delay={
                                                                    index * 100
                                                                }
                                                            >
                                                                {
                                                                    item.description
                                                                }
                                                            </ListItem>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>

                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className="bg-transparent hover:bg-accent/80 data-[state=open]:bg-accent/80 transition-all duration-200 font-medium">
                                            Components
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <div className="w-[600px] p-6">
                                                <div className="mb-6">
                                                    <div className="flex items-center space-x-3 mb-3">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/40 to-accent/20 flex items-center justify-center">
                                                            <Layers className="w-5 h-5 text-accent-foreground" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-semibold">
                                                                UI Components
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                Beautiful and
                                                                accessible React
                                                                components
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2">
                                                    {components.map(
                                                        (component, index) => (
                                                            <ListItem
                                                                key={
                                                                    component.title
                                                                }
                                                                title={
                                                                    component.title
                                                                }
                                                                href={
                                                                    component.href
                                                                }
                                                                icon={
                                                                    component.icon
                                                                }
                                                                delay={
                                                                    index * 50
                                                                }
                                                            >
                                                                {
                                                                    component.description
                                                                }
                                                            </ListItem>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>

                                    <NavigationMenuItem>
                                        <Link
                                            href="/docs"
                                            legacyBehavior
                                            passHref
                                        >
                                            <NavigationMenuLink
                                                className={cn(
                                                    navigationMenuTriggerStyle(),
                                                    'bg-transparent hover:bg-accent/80 transition-all duration-200 font-medium',
                                                )}
                                            >
                                                Documentation
                                            </NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>

                                    <NavigationMenuItem>
                                        <Link
                                            href="/pricing"
                                            legacyBehavior
                                            passHref
                                        >
                                            <NavigationMenuLink
                                                className={cn(
                                                    navigationMenuTriggerStyle(),
                                                    'bg-transparent hover:bg-accent/80 transition-all duration-200 font-medium',
                                                )}
                                            >
                                                Pricing
                                            </NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>

                        {/* Desktop CTA */}
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
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                                                <span className="text-primary-foreground font-bold text-sm">
                                                    L
                                                </span>
                                            </div>
                                            <span className="font-bold text-lg bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                                                Logo
                                            </span>
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
