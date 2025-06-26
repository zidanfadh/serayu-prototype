'use client';
//biar bisa deploy

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductionPlan, Product } from '@/lib/data';

export default function CreatePOPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productionPlanId = searchParams.get('production_plan_id');
  
  const [productionPlan, setProductionPlan] = useState<ProductionPlan | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    company: '',
    kode_part: '',
    quantity: '',
  });

  useEffect(() => {
    // Load products
    const savedProducts = localStorage.getItem('productList');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }

    // Load production plan if specified
    if (productionPlanId) {
      const plans = JSON.parse(localStorage.getItem('productionPlans') || '[]');
      const plan = plans.find((p: ProductionPlan) => p.id === productionPlanId);
      if (plan) {
        setProductionPlan(plan);
        setForm({
          company: plan.company,
          kode_part: plan.kode_part,
          quantity: '',
        });
      }
    }
  }, [productionPlanId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPO = {
      id: uuidv4(),
      production_plan_id: productionPlanId || '',
      company: form.company,
      kode_part: form.kode_part,
      quantity: form.quantity,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Save PO
    const existingPOs = JSON.parse(localStorage.getItem('poList') || '[]');
    localStorage.setItem('poList', JSON.stringify([...existingPOs, newPO]));

    // Update production plan if linked
    if (productionPlan) {
      const plans = JSON.parse(localStorage.getItem('productionPlans') || '[]');
      const updatedPlans = plans.map((plan: ProductionPlan) => {
        if (plan.id === productionPlanId) {
          return {
            ...plan,
            product_order_ids: [...(plan.product_order_ids || []), newPO.id],
            total_product_order: (plan.total_product_order || 0) + parseInt(form.quantity),
          };
        }
        return plan;
      });
      localStorage.setItem('productionPlans', JSON.stringify(updatedPlans));
    }

    router.push('/po');
  };

  return (
    <div className="flex items-center justify-center p-10">
      <div className="sm:mx-auto sm:max-w-2xl w-full">
        <h3 className="text-2xl font-semibold text-foreground">Buat PO Baru</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Lengkapi data berikut untuk membuat Purchase Order
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label htmlFor="company" className="text-sm font-medium text-foreground">
                Nama Perusahaan <span className="text-red-500">*</span>
              </Label>
              <Input
                id="company"
                name="company"
                placeholder="Masukkan nama perusahaan"
                required
                value={form.company}
                onChange={handleChange}
                className="mt-2"
                disabled={!!productionPlan}
              />
            </div>

            <div>
              <Label htmlFor="kode_part" className="text-sm font-medium text-foreground">
                Kode Part <span className="text-red-500">*</span>
              </Label>
              {productionPlan ? (
                <Input
                  id="kode_part"
                  name="kode_part"
                  value={form.kode_part}
                  className="mt-2"
                  disabled
                />
              ) : (
                <select
                  id="kode_part"
                  name="kode_part"
                  required
                  value={form.kode_part}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input px-3 py-2 mt-2"
                >
                  <option value="">Pilih Kode Part</option>
                  {products.map((product) => (
                    <option key={product.KODE_PART} value={product.KODE_PART}>
                      {product.KODE_PART} - {product.NAMA_PART}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <Label htmlFor="quantity" className="text-sm font-medium text-foreground">
                Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                id="quantity"
                name="quantity"
                placeholder="Masukkan quantity"
                required
                value={form.quantity}
                onChange={handleChange}
                className="mt-2"
              />
            </div>
          </div>

          <div className="my-6 border-t" />

          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="whitespace-nowrap cursor-pointer"
            >
              Batal
            </Button>
            <button
              type='submit'
              className="p-[3px] relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
              <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
                Buat PO
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
