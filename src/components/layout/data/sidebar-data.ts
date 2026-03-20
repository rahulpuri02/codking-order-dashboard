import {
  LayoutDashboard,
  ShieldAlert,
  Command,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Merchant',
    email: 'merchant@codking.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'COD King',
      logo: Command,
      plan: 'Order Risk Dashboard',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Order Risk',
          url: '/order-risk',
          icon: ShieldAlert,
        },
      ],
    },
  ],
}
