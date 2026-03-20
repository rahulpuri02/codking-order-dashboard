import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

function CardSkeleton() {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <Skeleton className='h-4 w-24' />
        <Skeleton className='size-4' />
      </CardHeader>
      <CardContent>
        <Skeleton className='h-7 w-16' />
        <Skeleton className='mt-2 h-3 w-32' />
      </CardContent>
    </Card>
  )
}

function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className='h-5 w-36' />
        <Skeleton className='h-3 w-44' />
      </CardHeader>
      <CardContent>
        <Skeleton className='h-[250px] w-full rounded-lg' />
      </CardContent>
    </Card>
  )
}

function TableSkeleton() {
  return (
    <div className='flex flex-col gap-4'>
      {/* Toolbar */}
      <div className='flex items-center gap-2'>
        <Skeleton className='h-9 w-64' />
        <Skeleton className='h-9 w-24' />
        <Skeleton className='h-9 w-24' />
        <Skeleton className='h-9 w-24' />
      </div>
      {/* Table */}
      <div className='overflow-hidden rounded-md border'>
        <div className='border-b p-3'>
          <div className='flex gap-6'>
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className='h-4 w-20' />
            ))}
          </div>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className='border-b p-3 last:border-0'>
            <div className='flex gap-6'>
              {Array.from({ length: 7 }).map((_, j) => (
                <Skeleton key={j} className='h-4 w-20' />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-4 w-32' />
        <div className='flex gap-2'>
          <Skeleton className='h-9 w-9' />
          <Skeleton className='h-9 w-9' />
        </div>
      </div>
    </div>
  )
}

export function LoadingSkeleton() {
  return (
    <>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className='grid gap-4 sm:grid-cols-2'>
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      <TableSkeleton />
    </>
  )
}
