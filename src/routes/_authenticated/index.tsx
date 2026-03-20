import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { OrderRisk } from '@/features/order-risk'

const searchSchema = z.object({
  filter: z.string().optional(),
  city: z.array(z.string()).optional(),
  order_status: z.array(z.string()).optional(),
  risk_level: z.array(z.string()).optional(),
  page: z.number().optional(),
  pageSize: z.number().optional(),
})

export const Route = createFileRoute('/_authenticated/')({
  component: OrderRisk,
  validateSearch: searchSchema,
})
