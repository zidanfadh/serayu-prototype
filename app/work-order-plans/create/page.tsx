'use client';
//biar bisa deploy

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductionPlan, WorkOrder, Product } from '@/lib/data';

export default function CreateWorkOrderPlanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productionPlanId = searchParams.get('production_plan_id');
  
  const [productionPlan, setProductionPlan] = useState<ProductionPlan | null>(null);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({
    week_number: '',
    month: '',
    year: '',
    start_date: '',
    end_date: '',
    start_production_date: '',
  });

  useEffect(() => {
    if (productionPlanId) {
      // Load production plan
      const plans = JSON.parse(localStorage.getItem('productionPlans') || '[]');
      const plan = plans.find((p: ProductionPlan) => p.id === productionPlanId);
      
      if (plan) {
        setProductionPlan(plan);
        
        // Load related work orders
        const allWOs = JSON.parse(localStorage.getItem('workOrdersList') || '[]');
        const relatedWOs = allWOs.filter((wo: WorkOrder) => 
          plan.work_order_ids?.includes(wo.id)
        );
        setWorkOrders(relatedWOs);

        // Load product details
        const products = JSON.parse(localStorage.getItem('productList') || '[]');
        const productDetail = products.find((p: Product) => p.KODE_PART === plan.kode_part);
        setProduct(productDetail);

        setForm({
          week_number: '',
          month: plan.month,
          year: plan.year,
          start_date: '',
          end_date: '',
          start_production_date: '',
        });
      }
    }
  }, [productionPlanId]);

  const calculateDates = (startProductionDate: string) => {
    if (!startProductionDate || workOrders.length === 0 || !product) return {};

    const startDate = new Date(startProductionDate);
    
    // Calculate total quantity from work orders
    const totalQuantity = workOrders.reduce((sum, wo) => sum + parseInt(wo.quantity), 0);
    
    // Production time: total quantity * 0.2 hours
    const productionHours = totalQuantity * 0.2;
    const endProductionDate = new Date(startDate.getTime() + (productionHours * 60 * 60 * 1000));
    
    // Plating: always 2 days
    const startPlatingDate = new Date(endProductionDate.getTime() + (24 * 60 * 60 * 1000)); // 1 day after production
    const endPlatingDate = new Date(startPlatingDate.getTime() + (2 * 24 * 60 * 60 * 1000)); // 2 days for plating
    
    // Deadline: 1 day after plating
    const deadlineDate = new Date(endPlatingDate.getTime() + (24 * 60 * 60 * 1000));

    return {
      endProductionDate,
      startPlatingDate,
      endPlatingDate,
      deadlineDate,
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!productionPlan || !product) return;

    const totalQuantity = workOrders.reduce((sum, wo) => sum + parseInt(wo.quantity), 0);
    const orderMaterialRjg = Math.ceil(totalQuantity / product.JUMLAH_Pcs_per_Rjg);
    const dates = calculateDates(form.start_production_date);

    const newWorkOrderPlan = {
      id: uuidv4(),
      production_plan_id: productionPlanId || '',
      product: {
        kode_part: productionPlan.kode_part,
        nama_part: product.NAMA_PART,
      },
      week_number: parseInt(form.week_number),
      month: form.month,
      year: form.year,
      start_date: new Date(form.start_date),
      end_date: new Date(form.end_date),
      order_material_rjg: orderMaterialRjg,
      order_material_kg: orderMaterialRjg * product.BERAT_per_RAJANG,
      start_production_date: new Date(form.start_production_date),
      end_production_date: dates.endProductionDate,
      start_plating_date: dates.startPlatingDate,
      end_plating_date: dates.endPlatingDate,
      deadline_date: dates.deadlineDate,
    };

    const existing = JSON.parse(localStorage.getItem('workOrderPlans') || '[]');
    localStorage.setItem('workOrderPlans', JSON.stringify([...existing, newWorkOrderPlan]));

    router.push('/work-order-plans');
  };

  const dates = calculateDates(form.start_production_date);
  const totalQuantity = workOrders.reduce((sum, wo) => sum + parseInt(wo.quantity), 0);
  const orderMaterialRjg = product ? Math.ceil(totalQuantity / product.JUMLAH_Pcs_per_Rjg) : 0;

  return (
    <div className="flex items-center justify-center p-10">
      <div className="sm:mx-auto sm:max-w-4xl w-full">
        <h3 className="text-2xl font-semibold text-foreground">Buat Work Order Plan</h3>
        
        {productionPlan && (
          <div className="bg-muted p-4 rounded-lg mt-4">
            <h4 className="font-semibold">Production Plan Details:</h4>
            <p>Company: {productionPlan.company}</p>
            <p>Kode Part: {productionPlan.kode_part}</p>
            <p>Total Work Orders: {workOrders.length}</p>
            <p>Total Quantity: {totalQuantity}</p>
            {product && (
              <p>Order Material (Rajang): {orderMaterialRjg} Rjg (Pcs per Rajang: {product.JUMLAH_Pcs_per_Rjg})</p>
            )}
            { product && (
                <p>Order Material (Kg): {orderMaterialRjg * product.BERAT_per_RAJANG} Kg</p>
            )}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="week_number">Week Number</Label>
              <Input
                type="number"
                id="week_number"
                name="week_number"
                required
                value={form.week_number}
                onChange={handleChange}
                className="mt-2"
                min="1"
                max="52"
              />
            </div>

            <div>
              <Label htmlFor="month">Month</Label>
              <Input
                id="month"
                name="month"
                required
                value={form.month}
                onChange={handleChange}
                className="mt-2"
                disabled
              />
            </div>

            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                name="year"
                required
                value={form.year}
                onChange={handleChange}
                className="mt-2"
                disabled
              />
            </div>

            <div>
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                type="date"
                id="start_date"
                name="start_date"
                required
                value={form.start_date}
                onChange={handleChange}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="end_date">End Date</Label>
              <Input
                type="date"
                id="end_date"
                name="end_date"
                required
                value={form.end_date}
                onChange={handleChange}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="start_production_date">Start Production Date</Label>
              <Input
                type="datetime-local"
                id="start_production_date"
                name="start_production_date"
                required
                value={form.start_production_date}
                onChange={handleChange}
                className="mt-2"
              />
            </div>
          </div>

          {form.start_production_date && dates.endProductionDate && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Calculated Dates:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p>End Production: {dates.endProductionDate.toLocaleString()}</p>
                <p>Start Plating: {dates.startPlatingDate?.toLocaleString()}</p>
                <p>End Plating: {dates.endPlatingDate?.toLocaleString()}</p>
                <p>Deadline: {dates.deadlineDate?.toLocaleString()}</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Batal
            </Button>
            <Button type="submit">
              Buat Work Order Plan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
