'use client';
//biar bisa deploy

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ProductionPlan, PO, WorkOrder, Product } from '@/lib/data';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Building, Package, FileText, Plus } from 'lucide-react';

export default function ProductionPlanDetailPage() {
  const router = useRouter();
  const params = useParams();
  const planId = params.id as string;
  
  const [productionPlan, setProductionPlan] = useState<ProductionPlan | null>(null);
  const [relatedPOs, setRelatedPOs] = useState<PO[]>([]);
  const [relatedWOs, setRelatedWOs] = useState<WorkOrder[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlanData = () => {
      try {
        // Load production plan
        const savedPlans = localStorage.getItem('productionPlans');
        if (savedPlans) {
          const plans = JSON.parse(savedPlans);
          const foundPlan = plans.find((p: ProductionPlan) => p.id === planId);
          
          if (foundPlan) {
            setProductionPlan(foundPlan);
            
            // Load related POs
            const savedPOs = localStorage.getItem('poList');
            if (savedPOs) {
              const pos = JSON.parse(savedPOs);
              const planPOs = pos.filter((po: PO) => 
                foundPlan.product_order_ids?.includes(po.id)
              );
              setRelatedPOs(planPOs);
            }
            
            // Load related Work Orders
            const savedWOs = localStorage.getItem('workOrdersList');
            if (savedWOs) {
              const wos = JSON.parse(savedWOs);
              const planWOs = wos.filter((wo: WorkOrder) => 
                foundPlan.work_order_ids?.includes(wo.id)
              );
              setRelatedWOs(planWOs);
            }
            
            // Load product details
            const savedProducts = localStorage.getItem('productList');
            if (savedProducts) {
              const products = JSON.parse(savedProducts);
              const foundProduct = products.find((p: Product) => p.KODE_PART === foundPlan.kode_part);
              setProduct(foundProduct || null);
            }
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading production plan:', error);
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
          <p className="mt-4 text-muted-foreground">Memuat data production plan...</p>
        </div>
      </div>
    );
  }

  if (!productionPlan) {
    return (
      <div className="container mx-auto py-10">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/production-plans')}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Kembali ke Production Plans
        </Button>
        <div className="bg-muted p-6 rounded-md text-center">
          <h1 className="text-xl font-semibold mb-4">Production Plan tidak ditemukan</h1>
          <p>Production Plan dengan ID {planId} tidak tersedia.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 md:max-w-6xl max-w-80">
      <Button 
        variant="ghost" 
        onClick={() => router.push('/production-plans')}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Kembali ke Production Plans
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Plan Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Production Plan Overview
              </CardTitle>
              <CardDescription>
                {productionPlan.month} {productionPlan.year} - {productionPlan.company}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Company</h3>
                    <p className="font-medium">{productionPlan.company}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Product Code</h3>
                    <p className="font-medium">{productionPlan.kode_part}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Period</h3>
                    <p className="font-medium">{productionPlan.month} {productionPlan.year}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Stock Previous</h3>
                    <p className="font-medium">{productionPlan.stock_lalu || 0} pcs</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Stock Target</h3>
                    <p className="font-medium">{productionPlan.stock_akhir} pcs</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Stock Range</h3>
                    <p className="font-medium">{productionPlan.stock_minimum} - {productionPlan.stock_maximum} pcs</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Orders */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Purchase Orders</CardTitle>
                  <CardDescription>
                    Total: {productionPlan.total_product_order || 0} pcs
                  </CardDescription>
                </div>
                <Button 
                  size="sm"
                  onClick={() => router.push(`/po/create?production_plan_id=${productionPlan.id}`)}
                  className="cursor-pointer"
                >
                  <Plus className="h-4 w-4 mr-2 cursor-pointer" />
                  Add PO
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {relatedPOs.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatedPOs.map((po) => (
                      <TableRow key={po.id}>
                        <TableCell>{po.company}</TableCell>
                        <TableCell>{po.quantity} pcs</TableCell>
                        <TableCell>{new Date(po.created_at).toLocaleDateString('id-ID')}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => router.push(`/po/${po.id}`)}
                            className='cursor-pointer'
                          >
                            Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-center py-4">No purchase orders created yet</p>
              )}
            </CardContent>
          </Card>

          {/* Work Orders */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Work Orders</CardTitle>
                  <CardDescription>
                    Total: {productionPlan.total_work_order || 0} pcs
                  </CardDescription>
                </div>
                <Button 
                  size="sm"
                  onClick={() => router.push(`/work-orders/create?production_plan_id=${productionPlan.id}`)}
                  className="cursor-pointer"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add WO
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {relatedWOs.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kode Part</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatedWOs.map((wo) => (
                      <TableRow key={wo.id}>
                        <TableCell>{wo.kode_part}</TableCell>
                        <TableCell>{wo.quantity} pcs</TableCell>
                        <TableCell>{new Date(wo.created_at).toLocaleDateString('id-ID')}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => router.push(`/work-orders/${wo.id}`)}
                          >
                            Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-center py-4">No work orders created yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Product Information */}
          {product && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Product Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Product Name</h3>
                  <p className="font-medium">{product.NAMA_PART}</p>
                </div>
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
                  className="w-full cursor-pointer"
                  onClick={() => router.push(`/products/${product.KODE_PART}`)}
                >
                  View Product Details
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Summary Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total POs:</span>
                <span className="font-medium">{relatedPOs.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total WOs:</span>
                <span className="font-medium">{relatedWOs.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">PO Quantity:</span>
                <span className="font-medium">{productionPlan.total_product_order || 0} pcs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">WO Quantity:</span>
                <span className="font-medium">{productionPlan.total_work_order || 0} pcs</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full cursor-pointer"
                onClick={() => router.push(`/work-order-plans/create?production_plan_id=${productionPlan.id}`)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Create Work Order Plan
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push(`/production-plans/${productionPlan.id}/edit`)}
              >
                Edit Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
