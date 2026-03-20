import { useMemo } from 'react'
import {
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { type Order } from '../data/schema'

const RISK_COLORS = {
  'High Risk': '#ef4444',
  'Medium Risk': '#eab308',
  Safe: '#22c55e',
}

const PAYMENT_COLORS = {
  COD: { stroke: '#f97316', fill: 'rgba(249, 115, 22, 0.3)' },
  Prepaid: { stroke: '#3b82f6', fill: 'rgba(59, 130, 246, 0.3)' },
}

interface RiskChartsProps {
  orders: Order[]
}

export function RiskCharts({ orders }: RiskChartsProps) {
  const riskData = useMemo(() => {
    const counts = { 'High Risk': 0, 'Medium Risk': 0, Safe: 0 }
    orders.forEach((o) => {
      counts[o.risk_level]++
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [orders])

  const cityData = useMemo(() => {
    const map = new Map<string, { cod: number; prepaid: number }>()
    orders.forEach((o) => {
      const entry = map.get(o.city) ?? { cod: 0, prepaid: 0 }
      if (o.payment_method === 'COD') entry.cod++
      else entry.prepaid++
      map.set(o.city, entry)
    })
    return [...map.entries()]
      .map(([city, counts]) => ({ city, ...counts }))
      .sort((a, b) => b.cod + b.prepaid - (a.cod + a.prepaid))
      .slice(0, 6)
  }, [orders])

  return (
    <div className='grid gap-4 sm:grid-cols-2'>
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Risk Distribution</CardTitle>
          <CardDescription>Orders by risk level</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={250}>
            <PieChart>
              <Pie
                data={riskData}
                cx='50%'
                cy='50%'
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey='value'
                nameKey='name'
                strokeWidth={0}
              >
                {riskData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={RISK_COLORS[entry.name as keyof typeof RISK_COLORS]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--background))',
                  fontSize: '12px',
                }}
              />
              <Legend
                verticalAlign='bottom'
                formatter={(value: string) => (
                  <span className='text-xs text-foreground'>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-base'>COD vs Prepaid</CardTitle>
          <CardDescription>Payment method by top cities</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={250}>
            <RadarChart data={cityData} cx='50%' cy='50%' outerRadius='70%'>
              <PolarGrid strokeDasharray='3 3' />
              <PolarAngleAxis
                dataKey='city'
                tick={{ fontSize: 11, fill: '#888888' }}
              />
              <PolarRadiusAxis
                tick={{ fontSize: 10, fill: '#888888' }}
                axisLine={false}
              />
              <Radar
                name='COD'
                dataKey='cod'
                stroke={PAYMENT_COLORS.COD.stroke}
                fill={PAYMENT_COLORS.COD.fill}
                strokeWidth={2}
              />
              <Radar
                name='Prepaid'
                dataKey='prepaid'
                stroke={PAYMENT_COLORS.Prepaid.stroke}
                fill={PAYMENT_COLORS.Prepaid.fill}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--background))',
                  fontSize: '12px',
                }}
              />
              <Legend
                formatter={(value: string) => (
                  <span className='text-xs text-foreground'>{value}</span>
                )}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
