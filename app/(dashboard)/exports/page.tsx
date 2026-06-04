"use client";

import { useState } from "react";
import { Download, FileJson, FileSpreadsheet, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function ExportsPage() {
  const [format, setFormat] = useState<"csv" | "jsonl">("jsonl");
  const [minConfidence, setMinConfidence] = useState([0.8]);
  const [dateRange, setDateRange] = useState("all");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const params = new URLSearchParams({
        format,
        minConf: minConfidence[0].toString(),
        days: dateRange,
      });

      const response = await fetch(`/api/export?${params.toString()}`);

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to export data");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const extension = format === "jsonl" ? "jsonl" : "csv";
      const dateStr = new Date().toISOString().split("T")[0];
      link.setAttribute("download", `gold_dataset_${dateStr}.${extension}`);

      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Dataset exported successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="mx-auto max-w-300 p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Export</h1>
        <p className="text-muted-foreground mt-1">
          Generate gold-standard datasets for machine learning or analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle>Export Configuration</CardTitle>
            <CardDescription>Filter your cleaned locations before downloading.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <label className="text-sm font-medium">Export Format</label>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={format === "jsonl" ? "default" : "outline"}
                  className={`h-24 flex flex-col gap-2 ${format === "jsonl" ? "bg-indigo-600 hover:bg-indigo-700" : ""}`}
                  onClick={() => setFormat("jsonl")}
                >
                  <FileJson className="h-6 w-6" />
                  <div className="text-center">
                    <span className="block font-semibold">JSONL</span>
                    <span className="text-xs opacity-80 font-normal">For LLM fine-tuning</span>
                  </div>
                </Button>

                <Button
                  type="button"
                  variant={format === "csv" ? "default" : "outline"}
                  className={`h-24 flex flex-col gap-2 ${format === "csv" ? "bg-indigo-600 hover:bg-indigo-700" : ""}`}
                  onClick={() => setFormat("csv")}
                >
                  <FileSpreadsheet className="h-6 w-6" />
                  <div className="text-center">
                    <span className="block font-semibold">CSV</span>
                    <span className="text-xs opacity-80 font-normal">For Excel & Analysis</span>
                  </div>
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Minimum AI Confidence</label>
                <span className="text-sm font-bold text-indigo-600">
                  {Math.round(minConfidence[0] * 100)}%
                </span>
              </div>
              <Slider
                defaultValue={[0.8]}
                max={1}
                min={0.5}
                step={0.05}
                value={minConfidence}
                onValueChange={setMinConfidence}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Higher confidence means fewer rows, but strictly accurate data.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Time Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="30">Last 30 Days</SelectItem>
                  <SelectItem value="7">Last 7 Days</SelectItem>
                  <SelectItem value="1">Last 24 Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 gap-2 h-12 text-md"
            >
              <Download className="h-5 w-5" />
              {isExporting ? "Generating File..." : "Download Dataset"}
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 border-dashed bg-muted/20">
          <CardHeader>
            <CardTitle className="text-xl">Format Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileJson className="h-4 w-4 text-indigo-600" />
                <h3 className="font-semibold text-sm">Why use JSONL?</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                JSON Lines (.jsonl) is the standard format required by OpenAI, Anthropic, and open-source models for fine-tuning. Every line in the file is a valid, standalone JSON object representing one location.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileSpreadsheet className="h-4 w-4 text-green-600" />
                <h3 className="font-semibold text-sm">Why use CSV?</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Comma Separated Values (.csv) are best if you need to hand off this data to a data analyst, map it in a tool like Tableau or ArcGIS, or manually review the outputs in Excel or Google Sheets.
              </p>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900/50 mt-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-400">Model Training Tip</h4>
                  <p className="text-sm text-amber-800 dark:text-amber-500 mt-1">
                    If you are exporting to fine-tune an SLM, we recommend setting the Minimum AI Confidence to at least 90% (0.9) to prevent hallucinations from bleeding into your new model.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}