import { createFileRoute } from '@tanstack/react-router'
import { OrderRisk } from '@/features/order-risk'

export const Route = createFileRoute('/_authenticated/order-risk/')({
  component: OrderRisk,
})
