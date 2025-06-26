'use client';
//biar bisa deploy

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { WorkOrderPlan, ProductionPlan, Product } from '@/lib/data';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Package, Clock, AlertTriangle } from 'lucide-react';

export default function WorkOrderPlanDetailPage() {
  const router = useRouter();
  const params = useParams();
  const planId = params.id as string;
  
  const [workOrderPlan, setWorkOrderPlan] = useState<WorkOrderPlan | null>(null);
  const [productionPlan, setProductionPlan] = useState<ProductionPlan | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlanData = () => {
      try {
        // Load work order plan
        const savedPlans = localStorage.getItem('workOrderPlans');
        if (savedPlans) {
          const plans = JSON.parse(savedPlans);
          const foundPlan = plans.find((p: WorkOrderPlan) => p.id === planId);
          
          if (foundPlan) {
            setWorkOrderPlan(foundPlan);
            
            // Load related production plan
            const savedProductionPlans = localStorage.getItem('productionPlans');
            if (savedProductionPlans) {
              const productionPlans = JSON.parse(savedProductionPlans);
              const foundProductionPlan = productionPlans.find((p: ProductionPlan) => p.id === foundPlan.production_plan_id);
              setProductionPlan(foundProductionPlan || null);
            }
            
            // Load product details
            const savedProducts = localStorage.getItem('productList');
            if (savedProducts) {
              const products = JSON.parse(savedProducts);
              const foundProduct = products.find((p: Product) => p.KODE_PART === foundPlan.product.kode_part);
              setProduct(foundProduct || null);
            }
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading work order plan:', error);
        setLoading(false);
      }
    };

    loadPlanData();
  }, [planId]);

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat data work order plan...</p>
        </div>
      </div>
    );
  }

  if (!workOrderPlan) {
    return (
      <div className="container mx-auto py-10">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/work-order-plans')}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Kembali ke Work Order Plans
        </Button>
        <div className="bg-muted p-6 rounded-md text-center">
          <h1 className="text-xl font-semibold mb-4">Work Order Plan tidak ditemukan</h1>
          <p>Work Order Plan dengan ID {planId} tidak tersedia.</p>
        </div>
      </div>
    );
  }

  // Calculate urgency
  const isUrgent = workOrderPlan.deadline_date && 
    new Date(workOrderPlan.deadline_date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <div className="container mx-auto py-10">
      <Button 
        variant="ghost" 
        onClick={() => router.push('/work-order-plans')}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Kembali ke Work Order Plans
      </Button>

      {isUrgent && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-semibold">Urgent Deadline</span>
          </div>
          <p className="text-red-600 text-sm mt-1">
            This work order plan has a deadline within the next 7 days.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Plan Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Work Order Plan Details
              </CardTitle>
              <CardDescription>
                Week {workOrderPlan.week_number}, {workOrderPlan.month} {workOrderPlan.year}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Product Code</h3>
                  <p className="font-medium">{workOrderPlan.product.kode_part}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Product Name</h3>
                  <p className="font-medium">{workOrderPlan.product.nama_part}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Week Number</h3>
                  <p className="font-medium">Week {workOrderPlan.week_number}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Period</h3>
                  <p className="font-medium">{workOrderPlan.month} {workOrderPlan.year}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-3">Material Requirements</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Material (Rajang)</h3>
                    <p className="font-medium">{workOrderPlan.order_material_rjg || '-'} rajang</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Material (Kg)</h3>
                    <p className="font-medium">{workOrderPlan.order_material_kg?.toFixed(2) || '-'} kg</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Production Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Plan Start Date</h3>
                    <p className="font-medium">
                      {workOrderPlan.start_date ? new Date(workOrderPlan.start_date).toLocaleDateString('id-ID') : '-'}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Plan End Date</h3>
                    <p className="font-medium">
                      {workOrderPlan.end_date ? new Date(workOrderPlan.end_date).toLocaleDateString('id-ID') : '-'}
                    </p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Production Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                      <div>
                        <p className="font-medium">Production Start</p>
                        <p className="text-sm text-muted-foreground">
                          {workOrderPlan.start_production_date 
                            ? new Date(workOrderPlan.start_production_date).toLocaleString('id-ID')
                            : 'Not scheduled'
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <div>
                        <p className="font-medium">Production End</p>
                        <p className="text-sm text-muted-foreground">
                          {workOrderPlan.end_production_date 
                            ? new Date(workOrderPlan.end_production_date).toLocaleString('id-ID')
                            : 'Not scheduled'
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                      <div>
                        <p className="font-medium">Plating Period</p>
                        <p className="text-sm text-muted-foreground">
                          {workOrderPlan.start_plating_date && workOrderPlan.end_plating_date
                            ? `${new Date(workOrderPlan.start_plating_date).toLocaleDateString('id-ID')} - ${new Date(workOrderPlan.end_plating_date).toLocaleDateString('id-ID')}`
                            : 'Not scheduled'
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className={`flex justify-between items-center p-3 rounded ${isUrgent ? 'bg-red-50' : 'bg-purple-50'}`}>
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Deadline
                        </p>
                        <p className={`text-sm ${isUrgent ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
                          {workOrderPlan.deadline_date 
                            ? new Date(workOrderPlan.deadline_date).toLocaleString('id-ID')
                            : 'Not set'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Production Plan Link */}
          {productionPlan && (
            <Card>
              <CardHeader>
                <CardTitle>Production Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Company</h3>
                    <p className="font-medium">{productionPlan.company}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Stock Target</h3>
                    <p className="font-medium">{productionPlan.stock_akhir} pcs</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => router.push(`/production-plans/${productionPlan.id}`)}
                  >
                    View Production Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Product Details Link */}
          {product && (
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Specification</h3>
                    <p className="font-medium">{product.SPEC}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">PCS per Rajang</h3>
                    <p className="font-medium">{product.JUMLAH_Pcs_per_Rjg} pcs</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => router.push(`/products/${product.KODE_PART}`)}
                  >
                    View Product
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push(`/work-order-plans/${workOrderPlan.id}/edit`)}
              >
                Edit Plan
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push(`/work-order-reports/create?week=${workOrderPlan.week_number}&month=${workOrderPlan.month}&year=${workOrderPlan.year}`)}
              >
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
