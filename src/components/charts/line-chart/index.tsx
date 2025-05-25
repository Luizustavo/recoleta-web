'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
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
import CountUp from 'react-countup';

export const description = 'An interactive bar chart';

const chartData = [
  { date: '2024-04-01', gerados: 222, reciclados: 150 },
  { date: '2024-04-02', gerados: 97, reciclados: 180 },
  { date: '2024-04-03', gerados: 167, reciclados: 120 },
  { date: '2024-04-04', gerados: 242, reciclados: 260 },
  { date: '2024-04-05', gerados: 373, reciclados: 290 },
  { date: '2024-04-06', gerados: 301, reciclados: 340 },
  { date: '2024-04-07', gerados: 245, reciclados: 180 },
  { date: '2024-04-08', gerados: 409, reciclados: 320 },
  { date: '2024-04-09', gerados: 59, reciclados: 110 },
  { date: '2024-04-10', gerados: 261, reciclados: 190 },
  { date: '2024-04-11', gerados: 327, reciclados: 350 },
  { date: '2024-04-12', gerados: 292, reciclados: 210 },
  { date: '2024-04-13', gerados: 342, reciclados: 380 },
  { date: '2024-04-14', gerados: 137, reciclados: 220 },
  { date: '2024-04-15', gerados: 120, reciclados: 170 },
  { date: '2024-04-16', gerados: 138, reciclados: 190 },
  { date: '2024-04-17', gerados: 446, reciclados: 360 },
  { date: '2024-04-18', gerados: 364, reciclados: 410 },
  { date: '2024-04-19', gerados: 243, reciclados: 180 },
  { date: '2024-04-20', gerados: 89, reciclados: 150 },
  { date: '2024-04-21', gerados: 137, reciclados: 200 },
  { date: '2024-04-22', gerados: 224, reciclados: 170 },
  { date: '2024-04-23', gerados: 138, reciclados: 230 },
  { date: '2024-04-24', gerados: 387, reciclados: 290 },
  { date: '2024-04-25', gerados: 215, reciclados: 250 },
  { date: '2024-04-26', gerados: 75, reciclados: 130 },
  { date: '2024-04-27', gerados: 383, reciclados: 420 },
  { date: '2024-04-28', gerados: 122, reciclados: 180 },
  { date: '2024-04-29', gerados: 315, reciclados: 240 },
  { date: '2024-04-30', gerados: 454, reciclados: 380 },
];

const chartConfig = {
  views: {
    label: 'Page Views',
  },
  gerados: {
    label: 'Gerados',
    color: '#ff7c1e',
  },
  reciclados: {
    label: 'Reciclados',
    color: '#4dd8f8',
  },
} satisfies ChartConfig;

export function LineChartComponent() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('gerados');

  const total = React.useMemo(
    () => ({
      gerados: chartData.reduce((acc, curr) => acc + curr.gerados, 0),
      reciclados: chartData.reduce((acc, curr) => acc + curr.reciclados, 0),
    }),
    []
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Quantidade de Resíduos</CardTitle>
          <CardDescription>Kg diários</CardDescription>
        </div>
        <div className="flex">
          {['gerados', 'reciclados'].map(key => {
            const chart = key as keyof typeof chartConfig;

            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  <CountUp
                    end={total[key as keyof typeof total]}
                    delay={1}
                    duration={3}
                  />
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className=" sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-64 w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={value => {
                const date = new Date(value);

                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={value => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
