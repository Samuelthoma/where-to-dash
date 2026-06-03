import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Sparkles, Download } from "lucide-react";

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="hover:border-indigo-500/50 transition-colors">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Play className="h-5 w-5 text-indigo-600" />
            Scraper Engine
          </CardTitle>
          <CardDescription>Gather new raw data from TikTok.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/scraping" passHref>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
              Go to Scraper
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:border-indigo-500/50 transition-colors">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            Process Raw Data
          </CardTitle>
          <CardDescription>Process raw data with Gemini 1.5.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/raw-data" passHref>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
              View Raw Data
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:border-indigo-500/50 transition-colors">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Download className="h-5 w-5 text-indigo-600" />
            Data Export
          </CardTitle>
          <CardDescription>Download gold-standard rows.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/exports" passHref>
            <Button variant="outline" className="w-full">
              Go to Export
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
