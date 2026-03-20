import {
  ShoppingCart,
  ShieldAlert,
  AlertTriangle,
  Banknote,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type Order } from '../data/schema'

interface AnalyticsCardsProps {
  orders: Order[]
}

export function AnalyticsCards({ orders }: AnalyticsCardsProps) {
  const totalOrders = orders.length
  const highRiskOrders = orders.filter(
    (o) => o.risk_level === 'High Risk'
  ).length
  const mediumRiskOrders = orders.filter(
    (o) => o.risk_level === 'Medium Risk'
  ).length
  const codOrders = orders.filter((o) => o.payment_method === 'COD').length
  const codPercentage =
    totalOrders > 0 ? Math.round((codOrders / totalOrders) * 100) : 0

  const cards = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: ShoppingCart,
      description: `${codOrders} COD · ${totalOrders - codOrders} Prepaid`,
    },
    {
      title: 'High Risk Orders',
      value: highRiskOrders,
      icon: ShieldAlert,
      description: `${totalOrders > 0 ? Math.round((highRiskOrders / totalOrders) * 100) : 0}% of total orders`,
      className: 'text-red-600 dark:text-red-400',
    },
    {
      title: 'Medium Risk Orders',
      value: mediumRiskOrders,
      icon: AlertTriangle,
      description: `${totalOrders > 0 ? Math.round((mediumRiskOrders / totalOrders) * 100) : 0}% of total orders`,
      className: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      title: 'COD Percentage',
      value: `${codPercentage}%`,
      icon: Banknote,
      description: `${codOrders} out of ${totalOrders} orders`,
    },
  ]

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{card.title}</CardTitle>
            <card.icon className='size-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.className ?? ''}`}>
              {card.value}
            </div>
            <p className='text-xs text-muted-foreground'>{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
