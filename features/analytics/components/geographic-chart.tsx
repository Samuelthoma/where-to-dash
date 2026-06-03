"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { CustomYAxisTick } from "./custom-y-axis-tick";

interface GeographicChartProps {
  data: any[];
}

export function GeographicChart({ data }: GeographicChartProps) {
  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader>
        <CardTitle>Geographic Distribution</CardTitle>
        <p className="text-sm text-muted-foreground">
          Top 5 cities in your current dataset.
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-62.5 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 40, left: 10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#e5e7eb"
              />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                width={140}
                interval={0}
                tick={<CustomYAxisTick />}
              />
              <Tooltip
                cursor={{ fill: "#f3f4f6" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar
                dataKey="count"
                fill="#0ea5e9"
                radius={[0, 4, 4, 0]}
                barSize={24}
              >
                <LabelList
                  dataKey="count"
                  position="right"
                  fill="#6b7280"
                  fontSize={12}
                  fontWeight={600}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
