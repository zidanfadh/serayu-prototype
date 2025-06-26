'use client';
//biar bisa deploy

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { WorkOrder, ProductionPlan, Product } from '@/lib/data';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Package, Calendar, Building, FileText } from 'lucide-react';

export default function WorkOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const workOrderId = params.id as string;
  
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [productionPlan, setProductionPlan] = useState<ProductionPlan | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorkOrderData = () => {
      try {
        // Load work order
        const savedWorkOrders = localStorage.getItem('workOrdersList');
        if (savedWorkOrders) {
          const workOrders = JSON.parse(savedWorkOrders);
          const foundWorkOrder = workOrders.find((wo: WorkOrder) => wo.id === workOrderId);
          
          if (foundWorkOrder) {
            setWorkOrder(foundWorkOrder);
            
            // Load related production plan
            const savedPlans = localStorage.getItem('productionPlans');
            if (savedPlans) {
              const plans = JSON.parse(savedPlans);
              const foundPlan = plans.find((p: ProductionPlan) => p.id === foundWorkOrder.production_plan_id);
              setProductionPlan(foundPlan || null);
            }
            
            // Load product details
            const savedProducts = localStorage.getItem('productList');
            if (savedProducts) {
              const products = JSON.parse(savedProducts);
              const foundProduct = products.find((p: Product) => p.KODE_PART === foundWorkOrder.kode_part);
              setProduct(foundProduct || null);
            }
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading work order:', error);
        setLoading(false);
      }
    };

    loadWorkOrderData();
  }, [workOrderId]);

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat data work order...</p>
        </div>
      </div>
    );
  }

  if (!workOrder) {
    return (
      <div className="container mx-auto py-10">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/work-orders')}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Kembali ke Work Orders
        </Button>
        <div className="bg-muted p-6 rounded-md text-center">
          <h1 className="text-xl font-semibold mb-4">Work Order tidak ditemukan</h1>
          <p>Work Order dengan ID {workOrderId} tidak tersedia.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Button 
        variant="ghost" 
        onClick={() => router.push('/work-orders')}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Kembali ke Work Orders
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Work Order Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Work Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Work Order ID</h3>
                  <p className="font-mono text-sm">{workOrder.id}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Kode Part</h3>
                  <p className="font-medium">{workOrder.kode_part}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Quantity</h3>
                  <p className="font-medium">{workOrder.quantity} pcs</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Status</h3>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    Active
                  </span>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Created</h3>
                    <p className="text-sm">{new Date(workOrder.created_at).toLocaleString('id-ID')}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Last Updated</h3>
                    <p className="text-sm">{new Date(workOrder.updated_at).toLocaleString('id-ID')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Information */}
          {product && (
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Nama Part</h3>
                    <p className="font-medium">{product.NAMA_PART}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">No Part</h3>
                    <p className="font-medium">{product.No_PART}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Spesifikasi</h3>
                    <p className="font-medium">{product.SPEC}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">PCS per Rajang</h3>
                    <p className="font-medium">{product.JUMLAH_Pcs_per_Rjg} pcs</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push(`/products/${product.KODE_PART}`)}
                  >
                    View Product Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Production Plan Info */}
          {productionPlan && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Production Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Company</h3>
                  <p className="font-medium">{productionPlan.company}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Period</h3>
                  <p className="font-medium">{productionPlan.month} {productionPlan.year}</p>
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
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full"
                onClick={() => router.push(`/work-order-plans/create?production_plan_id=${workOrder.production_plan_id}`)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Create Work Order Plan
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push(`/work-orders/${workOrder.id}/edit`)}
              >
                Edit Work Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
