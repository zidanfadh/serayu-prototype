// import Component from "@/components/home/table-dashboard";
// import { RainbowButton } from "@/components/ui/rainbow-button";
// import { ThemeSwitch } from "@/components/ui/theme-switch-button";

// export default function dashboard() {
//   return (
//     <div>
//       <div className="flex justify-center item-center">
//         <h1 className="font-bold text-5xl mt-10">Dashboard</h1>
//         <div className="flex justify-center items-center py-8">
//     </div>
//       </div>
//     <div className="flex justify-center-safe item-center py-10 mx-10">
//     <Component/>
//     </div>
//     </div>
//   )
// }

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  Package, 
  FileText, 
  ClipboardList, 
  Calendar, 
  BarChart3,
  TrendingUp,
  AlertTriangle 
} from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    productionPlans: 0,
    products: 0,
    pos: 0,
    workOrders: 0,
    workOrderPlans: 0,
    reports: 0,
  });

  useEffect(() => {
    // Load statistics from localStorage
    const loadStats = () => {
      const productionPlans = JSON.parse(localStorage.getItem('productionPlans') || '[]');
      const products = JSON.parse(localStorage.getItem('productList') || '[]');
      const pos = JSON.parse(localStorage.getItem('poList') || '[]');
      const workOrders = JSON.parse(localStorage.getItem('workOrdersList') || '[]');
      const workOrderPlans = JSON.parse(localStorage.getItem('workOrderPlans') || '[]');
      const reports = JSON.parse(localStorage.getItem('workOrdersReportList') || '[]');

      setStats({
        productionPlans: productionPlans.length,
        products: products.length,
        pos: pos.length,
        workOrders: workOrders.length,
        workOrderPlans: workOrderPlans.length,
        reports: reports.length,
      });
    };

    loadStats();
  }, []);

  const quickActions = [
    {
      title: 'Create Production Plan',
      description: 'Start a new production planning process',
      icon: Building,
      href: '/production-plans/create',
      color: 'bg-blue-500',
    },
    {
      title: 'Add Product',
      description: 'Add new product to the catalog',
      icon: Package,
      href: '/products/create',
      color: 'bg-green-500',
    },
    {
      title: 'Create Purchase Order',
      description: 'Generate a new purchase order',
      icon: FileText,
      href: '/po/create',
      color: 'bg-purple-500',
    },
    {
      title: 'Create Work Order',
      description: 'Start a new work order',
      icon: ClipboardList,
      href: '/work-orders/create',
      color: 'bg-orange-500',
    },
    {
      title: 'Generate Report',
      description: 'Create work order reports',
      icon: BarChart3,
      href: '/work-order-reports/create',
      color: 'bg-red-500',
    },
  ];

  const statsCards = [
    {
      title: 'Production Plans',
      value: stats.productionPlans,
      icon: Building,
      href: '/production-plans',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Products',
      value: stats.products,
      icon: Package,
      href: '/products',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Purchase Orders',
      value: stats.pos,
      icon: FileText,
      href: '/po',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Work Orders',
      value: stats.workOrders,
      icon: ClipboardList,
      href: '/work-orders',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Work Order Plans',
      value: stats.workOrderPlans,
      icon: Calendar,
      href: '/work-order-plans',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
    {
      title: 'Reports',
      value: stats.reports,
      icon: BarChart3,
      href: '/work-order-reports',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to Serayu ERP System</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statsCards.map((stat) => (
          <Card 
            key={stat.title}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push(stat.href)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Card key={action.title} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${action.color} text-white`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => router.push(action.href)}
                    >
                      Start
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              System Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Production Plans</span>
                <span className="font-medium">{stats.productionPlans}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Work Orders</span>
                <span className="font-medium">{stats.workOrders}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Scheduled Plans</span>
                <span className="font-medium">{stats.workOrderPlans}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Generated Reports</span>
                <span className="font-medium">{stats.reports}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Quick Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-900">Start with Production Plans</p>
                <p className="text-blue-700">Create production plans first, then generate POs and WOs from them.</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="font-medium text-green-900">Work Order Plans</p>
                <p className="text-green-700">Generate work order plans to schedule production and calculate material requirements.</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="font-medium text-purple-900">Reports</p>
                <p className="text-purple-700">Create weekly reports to track progress and manage deadlines.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}