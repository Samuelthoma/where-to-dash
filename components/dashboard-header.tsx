"use client"

import { useMemo } from "react"
import { usePathname } from "next/navigation"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Separator } from "@/components/ui/separator"

import {
    SidebarTrigger,
} from "@/components/ui/sidebar"

const breadcrumbMap: Record<
    string,
    {
        category?: string
        label: string
    }
> = {
    dashboard: {
        label: "Dashboard",
    },

    scraping: {
        category: "Data Pipeline",
        label: "Scraping Jobs",
    },

    "raw-data": {
        category: "Data Pipeline",
        label: "Raw Data",
    },

    cleaning: {
        category: "Data Pipeline",
        label: "Cleaning Queue",
    },

    "cleaned-data": {
        category: "Data Pipeline",
        label: "Cleaned Data",
    },

    search: {
        category: "Discovery",
        label: "Search Explorer",
    },

    analytics: {
        category: "Discovery",
        label: "Analytics",
    },

    exports: {
        category: "Management",
        label: "Exports",
    },

    rules: {
        category: "Management",
        label: "Rules",
    },

    settings: {
        category: "Management",
        label: "Settings",
    },
}

export function DashboardHeader() {
    const pathname = usePathname()

    const segments = pathname
        .split("/")
        .filter(Boolean)

    const breadcrumbItems = useMemo(() => {
        const current = segments[0]

        const config = breadcrumbMap[current]

        if (!config) return []

        const items = []

        if (config.category) {
            items.push({
                label: config.category,
            })
        }

        items.push({
            label: config.label,
        })

        return items
    }, [segments])

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />

                <Separator
                    orientation="vertical"
                    className="mr-2 h-4"
                />

                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbItems.map((item, index) => (
                            <div
                                key={item.label}
                                className="flex items-center"
                            >
                                <BreadcrumbItem>
                                    <BreadcrumbPage>
                                        {item.label}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>

                                {index <
                                    breadcrumbItems.length - 1 && (
                                        <BreadcrumbSeparator />
                                    )}
                            </div>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    )
}