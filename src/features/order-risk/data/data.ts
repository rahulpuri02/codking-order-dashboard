import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react'
import { env } from '@/lib/environment'
import { rawOrderSchema, type Order, type RawOrder, type RiskLevel } from './schema'

export const RISK_THRESHOLDS = {
  HIGH: 70,
  MEDIUM: 40,
} as const

export const riskLevelOptions: {
  value: RiskLevel
  label: string
  icon: LucideIcon
}[] = [
  { value: 'High Risk', label: 'High Risk', icon: ShieldAlert },
  { value: 'Medium Risk', label: 'Medium Risk', icon: AlertTriangle },
  { value: 'Safe', label: 'Safe', icon: ShieldCheck },
]

export const orderStatusOptions = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Delivered', label: 'Delivered' },
  { value: 'Cancelled', label: 'Cancelled' },
  { value: 'RTO', label: 'RTO' },
]

export const paymentMethodOptions = [
  { value: 'COD', label: 'COD' },
  { value: 'Prepaid', label: 'Prepaid' },
]

export function calculateRiskScore(order: RawOrder): number {
  if (order.total_orders === 0) return 0
  return Math.round((order.cod_orders / order.total_orders) * 100)
}

export function getRiskLevel(score: number): RiskLevel {
  if (score >= RISK_THRESHOLDS.HIGH) return 'High Risk'
  if (score >= RISK_THRESHOLDS.MEDIUM) return 'Medium Risk'
  return 'Safe'
}

export function enrichOrder(raw: RawOrder): Order {
  const risk_score = calculateRiskScore(raw)
  return {
    ...raw,
    risk_score,
    risk_level: getRiskLevel(risk_score),
  }
}

export async function fetchOrders(): Promise<Order[]> {
  const response = await fetch(env.VITE_ORDERS_API_URL)
  if (!response.ok) throw new Error('Failed to fetch orders')
  const json = await response.json()
  const raw = rawOrderSchema.array().parse(json)
  return raw.map(enrichOrder)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount)
}
