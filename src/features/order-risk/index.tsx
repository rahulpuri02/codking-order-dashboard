import { useEffect, useState } from 'react'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { AnalyticsCards } from './components/analytics-cards'
import { OrdersTable } from './components/orders-table'
import { fetchOrders } from './data/data'
import { type Order } from './data/schema'

export function OrderRisk() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

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
          <ProfileDropdown />
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
          <div className='text-sm text-muted-foreground'>Loading orders...</div>
        ) : (
          <>
            <AnalyticsCards orders={orders} />
            <OrdersTable data={orders} />
          </>
        )}
      </Main>
    </>
  )
}
