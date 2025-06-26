'use client';

import { Inter } from 'next/font/google'
import './globals.css'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Building, 
  Package, 
  FileText, 
  Calendar, 
  ClipboardList, 
  BarChart3,
  Menu,
  X,
  Home
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Production Plans', href: '/production-plans', icon: Building },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Purchase Orders', href: '/po', icon: FileText },
  { name: 'Work Orders', href: '/work-orders', icon: ClipboardList },
  { name: 'Work Order Plans', href: '/work-order-plans', icon: Calendar },
  { name: 'Reports', href: '/work-order-reports', icon: BarChart3 },
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-50">
          {/* Sidebar */}
          <div className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 lg:static lg:inset-0
          `}>
            <div className="flex items-center justify-between h-16 px-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Serayu ERP</h2>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <nav className="mt-5 px-2">
              <div className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href !== '/' && pathname.startsWith(item.href))
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                        group flex items-center px-2 py-2 text-sm font-medium rounded-md
                        ${isActive
                          ? 'bg-indigo-100 text-indigo-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon
                        className={`
                          mr-3 h-5 w-5 flex-shrink-0
                          ${isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}
                        `}
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
            {/* Top bar */}
            <div className="lg:hidden bg-white shadow-sm border-b">
              <div className="flex items-center justify-between h-16 px-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-semibold">Serayu ERP</h1>
                <div className="w-8" />
              </div>
            </div>

            {/* Page content */}
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>

        {/* Sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </body>
    </html>
  )
}