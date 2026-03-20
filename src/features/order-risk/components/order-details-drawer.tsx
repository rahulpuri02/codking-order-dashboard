import { useState } from 'react'
import {
  MessageSquare,
  CreditCard,
  ShieldCheck,
  Phone,
  MapPin,
  Package,
  Calendar,
  IndianRupee,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { formatCurrency, riskLevelOptions } from '../data/data'
import { type Order } from '../data/schema'

const riskBadgeColors: Record<string, string> = {
  'High Risk':
    'bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400',
  'Medium Risk':
    'bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400',
  Safe: 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400',
}

const riskBarColors: Record<string, string> = {
  'High Risk': 'bg-red-500',
  'Medium Risk': 'bg-yellow-500',
  Safe: 'bg-green-500',
}

export type OrderAction = 'otp' | 'prepaid' | 'safe'

interface OrderDetailsDrawerProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAction?: (orderId: string, action: OrderAction) => void
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: React.ReactNode
}) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
        <Icon className='size-4' />
        {label}
      </div>
      <span className='text-sm font-medium'>{value}</span>
    </div>
  )
}

export function OrderDetailsDrawer({
  order,
  open,
  onOpenChange,
  onAction,
}: OrderDetailsDrawerProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [actionDone, setActionDone] = useState<string | null>(null)

  if (!order) return null

  const riskOption = riskLevelOptions.find((o) => o.value === order.risk_level)
  const codPercentage =
    order.total_orders > 0
      ? Math.round((order.cod_orders / order.total_orders) * 100)
      : 0

  const handleAction = (action: OrderAction) => {
    setActionLoading(action)
    setTimeout(() => {
      setActionLoading(null)
      setActionDone(action)
      onAction?.(order.order_id, action)
      setTimeout(() => setActionDone(null), 2000)
    }, 1500)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='overflow-y-auto sm:max-w-md'>
        <SheetHeader>
          <SheetTitle>Order {order.order_id}</SheetTitle>
          <SheetDescription>
            Placed by {order.customer} on{' '}
            {new Date(order.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </SheetDescription>
        </SheetHeader>

        <div className='flex flex-col gap-6 px-4 pb-4'>
          {/* Risk Score */}
          <div className='rounded-lg border p-4'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>Risk Score</span>
              <Badge
                variant='secondary'
                className={cn('gap-1', riskBadgeColors[order.risk_level])}
              >
                {riskOption?.icon && <riskOption.icon className='size-3' />}
                {order.risk_level}
              </Badge>
            </div>
            <div className='mt-3 flex items-center gap-3'>
              <div className='h-2 flex-1 rounded-full bg-muted'>
                <div
                  className={cn(
                    'h-2 rounded-full transition-all',
                    riskBarColors[order.risk_level]
                  )}
                  style={{ width: `${order.risk_score}%` }}
                />
              </div>
              <span className='font-mono text-sm font-semibold'>
                {order.risk_score}%
              </span>
            </div>
          </div>

          {/* Customer Info */}
          <div className='flex flex-col gap-3'>
            <h4 className='text-sm font-semibold'>Customer Info</h4>
            <DetailRow icon={Phone} label='Phone' value={order.phone} />
            <DetailRow icon={MapPin} label='City' value={order.city} />
          </div>

          <Separator />

          <div className='flex flex-col gap-3'>
            <h4 className='text-sm font-semibold'>Order Details</h4>
            <DetailRow
              icon={IndianRupee}
              label='Order Value'
              value={formatCurrency(order.order_value)}
            />
            <DetailRow icon={Package} label='Items' value={order.items} />
            <DetailRow
              icon={CreditCard}
              label='Payment'
              value={order.payment_method}
            />
            <DetailRow
              icon={Calendar}
              label='Status'
              value={order.order_status}
            />
          </div>

          <Separator />

          {/* COD vs Prepaid Breakdown */}
          <div className='flex flex-col gap-3'>
            <h4 className='text-sm font-semibold'>Order History</h4>
            <div className='grid grid-cols-3 gap-3'>
              <div className='rounded-lg border p-3 text-center'>
                <p className='text-lg font-semibold'>{order.total_orders}</p>
                <p className='text-xs text-muted-foreground'>Total</p>
              </div>
              <div className='rounded-lg border p-3 text-center'>
                <p className='text-lg font-semibold'>{order.cod_orders}</p>
                <p className='text-xs text-muted-foreground'>COD</p>
              </div>
              <div className='rounded-lg border p-3 text-center'>
                <p className='text-lg font-semibold'>{order.prepaid_orders}</p>
                <p className='text-xs text-muted-foreground'>Prepaid</p>
              </div>
            </div>
            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
              <div className='h-1.5 flex-1 rounded-full bg-muted'>
                <div
                  className='h-1.5 rounded-full bg-orange-500'
                  style={{ width: `${codPercentage}%` }}
                />
              </div>
              <span>{codPercentage}% COD</span>
            </div>
          </div>

          <Separator />

          <div className='flex flex-col gap-3'>
            <h4 className='text-sm font-semibold'>Actions</h4>
            <div className='grid grid-cols-1 gap-2'>
              <Button
                variant='outline'
                className='h-11 justify-start gap-2.5 border-violet-200 hover:bg-violet-50 dark:border-violet-900/50 dark:hover:bg-violet-950/30'
                disabled={actionLoading !== null}
                onClick={() => handleAction('otp')}
              >
                {actionLoading === 'otp' ? (
                  <Loader2 className='size-4 animate-spin text-violet-500' />
                ) : actionDone === 'otp' ? (
                  <CheckCircle2 className='size-4 text-green-500' />
                ) : (
                  <MessageSquare className='size-4 text-violet-500' />
                )}
                {actionLoading === 'otp'
                  ? 'Sending OTP...'
                  : actionDone === 'otp'
                    ? 'OTP Sent!'
                    : 'Send OTP'}
              </Button>
              <Button
                variant='outline'
                className='h-11 justify-start gap-2.5 border-blue-200 hover:bg-blue-50 dark:border-blue-900/50 dark:hover:bg-blue-950/30'
                disabled={actionLoading !== null}
                onClick={() => handleAction('prepaid')}
              >
                {actionLoading === 'prepaid' ? (
                  <Loader2 className='size-4 animate-spin text-blue-500' />
                ) : actionDone === 'prepaid' ? (
                  <CheckCircle2 className='size-4 text-green-500' />
                ) : (
                  <CreditCard className='size-4 text-blue-500' />
                )}
                {actionLoading === 'prepaid'
                  ? 'Converting...'
                  : actionDone === 'prepaid'
                    ? 'Converted!'
                    : 'Force Prepaid'}
              </Button>
              <Button
                variant='outline'
                className='h-11 justify-start gap-2.5 border-green-200 hover:bg-green-50 dark:border-green-900/50 dark:hover:bg-green-950/30'
                disabled={actionLoading !== null}
                onClick={() => handleAction('safe')}
              >
                {actionLoading === 'safe' ? (
                  <Loader2 className='size-4 animate-spin text-green-500' />
                ) : actionDone === 'safe' ? (
                  <CheckCircle2 className='size-4 text-green-500' />
                ) : (
                  <ShieldCheck className='size-4 text-green-500' />
                )}
                {actionLoading === 'safe'
                  ? 'Marking...'
                  : actionDone === 'safe'
                    ? 'Marked Safe!'
                    : 'Mark Safe'}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
