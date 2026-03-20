import { useCallback, useEffect, useState } from 'react'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { AnalyticsCards } from './components/analytics-cards'
import { LoadingSkeleton } from './components/loading-skeleton'
import {
  OrderDetailsDrawer,
  type OrderAction,
} from './components/order-details-drawer'
import { OrdersTable } from './components/orders-table'
import { RiskCharts } from './components/risk-charts'
import { enrichOrder, fetchOrders } from './data/data'
import { type Order } from './data/schema'

export function OrderRisk() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const handleAction = useCallback((orderId: string, action: OrderAction) => {
    const updateOrder = (order: Order): Order => {
      if (action === 'prepaid') {
        const updated = {
          ...order,
          payment_method: 'Prepaid' as const,
          prepaid_orders: order.prepaid_orders + 1,
          cod_orders: Math.max(0, order.cod_orders - 1),
        }
        return enrichOrder(updated)
      }
      if (action === 'safe') {
        return { ...order, risk_score: 0, risk_level: 'Safe' as const }
      }
      return order
    }

    setOrders((prev) =>
      prev.map((o) => (o.order_id === orderId ? updateOrder(o) : o))
    )
    setSelectedOrder((prev) =>
      prev?.order_id === orderId ? updateOrder(prev) : prev
    )
  }, [])

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            Order Risk Dashboard
          </h2>
          <p className='text-muted-foreground'>
            Monitor potentially risky orders and take actions.
          </p>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <AnalyticsCards orders={orders} />
            <RiskCharts orders={orders} />
            <OrdersTable data={orders} onRowClick={setSelectedOrder} />
          </>
        )}
      </Main>

      <OrderDetailsDrawer
        order={selectedOrder}
        open={selectedOrder !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedOrder(null)
        }}
        onAction={handleAction}
      />
    </>
  )
}
