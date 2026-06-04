"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Database,
  Search,
  Settings,
  Sparkles,
  ShieldCheck,
  Layers3,
  BarChart3,
  Download,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },

    {
      title: "Data Pipeline",
      icon: Database,
      items: [
        {
          title: "Scraping Jobs",
          url: "/scraping",
          icon: Sparkles,
        },
        {
          title: "Raw Data",
          url: "/raw-data",
          icon: Database,
        },
        {
          title: "Cleaning Queue",
          url: "/cleaning",
          icon: ShieldCheck,
        },
        {
          title: "Cleaned Data",
          url: "/cleaned-data",
          icon: Layers3,
        },
      ],
    },

    {
      title: "Discovery",
      icon: Search,
      items: [
        {
          title: "Search Explorer",
          url: "/search",
          icon: Search,
        },
        {
          title: "Analytics",
          url: "/analytics",
          icon: BarChart3,
        },
      ],
    },

    {
      title: "Management",
      icon: Settings,
      items: [
        {
          title: "Exports",
          url: "/exports",
          icon: Download,
        },
        {
          title: "Settings",
          url: "/settings",
          icon: Settings,
        },
      ],
    },
  ],
}

export function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="px-2 py-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Database className="h-4 w-4" />
          </div>

          <div className="flex min-w-0 flex-col transition-all duration-200 group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-semibold">
              Data Scraper
            </span>

            <span className="truncate text-xs text-muted-foreground">
              Data Cleaning Dashboard
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}