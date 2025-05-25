'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
const chartData = [
  { browser: 'chrome', Parceiros: 275, fill: 'var(--color-chrome)' },
  { browser: 'safari', Parceiros: 200, fill: 'var(--color-safari)' },
  { browser: 'firefox', Parceiros: 287, fill: 'var(--color-firefox)' },
  { browser: 'edge', Parceiros: 173, fill: 'var(--color-edge)' },
  { browser: 'other', Parceiros: 190, fill: 'var(--color-other)' },
];

const chartConfig = {
  Parceiros: {
    label: 'Parceiros',
  },
  chrome: {
    label: 'Chrome',
    color: '#84f84d',
  },
  safari: {
    label: 'Safari',
    color: '#4dd8f8',
  },
  firefox: {
    label: 'Firefox',
    color: '#ff7c1e',
  },
  edge: {
    label: 'Edge',
    color: '#ff1e1e',
  },
  other: {
    label: 'Other',
    color: '#b1b1b1',
  },
} satisfies ChartConfig;

export function PieChartText() {
  const totalParceiros = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.Parceiros, 0);
  }, []);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-start pb-0">
        <CardTitle>Principais parceiros</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="Parceiros"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalParceiros.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Parceiros
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
