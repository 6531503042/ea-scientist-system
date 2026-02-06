'use client';

import React, { ReactNode } from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface PageHeaderProps {
    title: string;
    right?: ReactNode;
    description?: string;
    icon?: ReactNode;
    showBreadcrumbs?: boolean;
}

export function PageHeader({ title, right, icon, description, showBreadcrumbs = true }: PageHeaderProps) {
    const pathname = usePathname();
    const paths = pathname.split('/').filter(Boolean);

    return (
        <div className="w-full space-y-4">
            {/* Header with Icon */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                    {icon && (
                        <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                            <span className="text-primary-foreground">{icon}</span>
                        </div>
                    )}
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                            {title}
                        </h1>
                        {description && (
                            <p className="text-sm text-muted-foreground mt-0.5">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
                {right && <div className="flex-shrink-0">{right}</div>}
            </div>

            {/* Breadcrumbs in bordered container */}
            {showBreadcrumbs && (
                <div className="border border-border rounded-lg px-4 py-3 bg-muted/30">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        Home
                                    </Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {paths.map((path, index) => {
                                const href = `/${paths.slice(0, index + 1).join('/')}`;
                                const isLast = index === paths.length - 1;
                                const label = path.charAt(0).toUpperCase() + path.slice(1);

                                return (
                                    <React.Fragment key={path}>
                                        <BreadcrumbSeparator className="text-muted-foreground/50" />
                                        <BreadcrumbItem>
                                            {isLast ? (
                                                <BreadcrumbPage className="text-sm font-medium text-foreground">
                                                    {label}
                                                </BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink asChild>
                                                    <Link href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                                        {label}
                                                    </Link>
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                    </React.Fragment>
                                );
                            })}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            )}
        </div>
    );
}
