'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';

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
  { residuo: 'Metal', quantidade: 186 },
  { residuo: 'Borracha', quantidade: 305 },
  { residuo: 'Óleo', quantidade: 237 },
  { residuo: 'Papel', quantidade: 73 },
  { residuo: 'Plástico', quantidade: 209 },
  { residuo: 'Vidro', quantidade: 214 },
];

const chartConfig = {
  quantidade: {
    label: 'quantidade',
    color: '#4bd609',
  },
  label: {
    color: '#ffffff',
  },
} satisfies ChartConfig;

export function BarChartLabel() {
  return (
    <Card className="max-h-full">
      <CardHeader>
        <CardTitle>Resíduos reciclados</CardTitle>
        <CardDescription>Categorias</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-60 w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="residuo"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={value => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="quantidade" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="quantidade"
              layout="vertical"
              fill="var(--color-quantidade)"
              radius={4}
            >
              <LabelList
                dataKey="residuo"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label] font-bold"
                fontSize={12}
              />
              <LabelList
                dataKey="quantidade"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
