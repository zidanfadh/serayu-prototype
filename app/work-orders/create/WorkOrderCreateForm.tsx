'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductionPlan } from '@/lib/data';

export function WorkOrderCreateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productionPlanId = searchParams.get('production_plan_id');
  
  const [productionPlan, setProductionPlan] = useState<ProductionPlan | null>(null);
  const [form, setForm] = useState({
    kode_part: '',
    quantity: '',
  });

  useEffect(() => {
    if (productionPlanId) {
      const plans = JSON.parse(localStorage.getItem('productionPlans') || '[]');
      const plan = plans.find((p: ProductionPlan) => p.id === productionPlanId);
      if (plan) {
        setProductionPlan(plan);
        setForm({
          kode_part: plan.kode_part,
          quantity: '',
        });
      }
    }
  }, [productionPlanId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newWO = {
      id: uuidv4(),
      production_plan_id: productionPlanId || '',
      kode_part: form.kode_part,
      quantity: form.quantity,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Save Work Order
    const existingWOs = JSON.parse(localStorage.getItem('workOrdersList') || '[]');
    localStorage.setItem('workOrdersList', JSON.stringify([...existingWOs, newWO]));

    // Update production plan
    if (productionPlan) {
      const plans = JSON.parse(localStorage.getItem('productionPlans') || '[]');
      const updatedPlans = plans.map((plan: ProductionPlan) => {
        if (plan.id === productionPlanId) {
          return {
            ...plan,
            work_order_ids: [...(plan.work_order_ids || []), newWO.id],
            total_work_order: (plan.total_work_order || 0) + parseInt(form.quantity),
          };
        }
        return plan;
      });
      localStorage.setItem('productionPlans', JSON.stringify(updatedPlans));
    }

    router.push('/work-orders');
  };

  return (
    <div className="flex items-center justify-center p-10">
      <div className="sm:mx-auto sm:max-w-2xl w-full">
        <h3 className="text-2xl font-semibold text-foreground">Buat Work Order</h3>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label htmlFor="kode_part">Kode Part</Label>
              <Input
                id="kode_part"
                name="kode_part"
                required
                value={form.kode_part}
                onChange={handleChange}
                className="mt-2"
                disabled={!!productionPlan}
              />
            </div>

            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                type="number"
                id="quantity"
                name="quantity"
                required
                value={form.quantity}
                onChange={handleChange}
                className="mt-2"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Batal
            </Button>
            <Button type="submit">
              Buat Work Order
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}