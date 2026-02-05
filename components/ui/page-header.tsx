'use client';

import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface PageHeaderProps {
    title: string;
    right?: ReactNode;
    description?: string;
    icon?: ReactNode;
}

export function PageHeader({ title, right, icon, description }: PageHeaderProps) {
    const pathname = usePathname();
    const paths = pathname.split('/').filter(Boolean);

    return (
        <div className="mb-6 w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div className="flex items-center gap-4">
                    {icon && (
                        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                            <span className="text-primary">{icon}</span>
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            {title}
                        </h1>
                        {description && (
                            <p className="text-sm text-muted-foreground">{description}</p>
                        )}
                    </div>
                </div>
                {right && <div className="mt-4 md:mt-0">{right}</div>}
            </div>

            {/* Breadcrumbs */}
            <nav className="flex items-center text-sm text-muted-foreground mb-6">
                <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                {paths.map((path, index) => {
                    const href = `/${paths.slice(0, index + 1).join('/')}`;
                    const isLast = index === paths.length - 1;
                    return (
                        <div key={path} className="flex items-center">
                            <ChevronRight className="w-4 h-4 mx-1" />
                            {isLast ? (
                                <span className="font-medium text-foreground capitalize">
                                    {path}
                                </span>
                            ) : (
                                <Link href={href} className="hover:text-foreground transition-colors capitalize">
                                    {path}
                                </Link>
                            )}
                        </div>
                    );
                })}
            </nav>
        </div>
    );
}
