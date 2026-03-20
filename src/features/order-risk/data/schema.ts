import { z } from 'zod'

export const rawOrderSchema = z.object({
  order_id: z.string(),
  customer: z.string(),
  phone: z.string(),
  city: z.string(),
  order_value: z.number(),
  total_orders: z.number(),
  cod_orders: z.number(),
  prepaid_orders: z.number(),
  payment_method: z.enum(['COD', 'Prepaid']),
  order_status: z.string(),
  items: z.number(),
  created_at: z.string(),
})

export type RawOrder = z.infer<typeof rawOrderSchema>

export type RiskLevel = 'High Risk' | 'Medium Risk' | 'Safe'

export interface Order extends RawOrder {
  risk_score: number
  risk_level: RiskLevel
}
