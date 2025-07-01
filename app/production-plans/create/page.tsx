'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from '@/lib/data';
import { DropdownMenu } from "@/components/ui/dropdown-menu2";
import { Pencil, Trash, Copy, Check } from "lucide-react";

export default function CreateProductionPlanPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    company: '',
    kode_part: '',
    month: '',
    year: '',
    stock_lalu: 0,
    stock_akhir: 0,
    stock_minimum: 0,
    stock_maximum: 0,
  });

  useEffect(() => {
    const savedProducts = localStorage.getItem('productList');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: ['stock_lalu', 'stock_akhir', 'stock_minimum', 'stock_maximum'].includes(name)
        ? Number(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPlan = {
      id: uuidv4(),
      ...form,
      product_order_ids: [],
      work_order_ids: [],
      total_product_order: 0,
      total_work_order: 0,
    };

    const existing = JSON.parse(localStorage.getItem('productionPlans') || '[]');
    localStorage.setItem('productionPlans', JSON.stringify([...existing, newPlan]));

    router.push('/production-plans');
  };

  return (
    <div className="flex items-center justify-center p-10">
      <div className="sm:mx-auto sm:max-w-2xl w-full">
        <h3 className="text-2xl font-semibold text-foreground text-shadow-md">Buat Production Plan</h3>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="company">Nama Perusahaan</Label>
              <Input
                id="company"
                name="company"
                required
                value={form.company}
                onChange={handleChange}
                className="mt-2 shadow-cyan-500/50 rounded-xl border-b-4 inset-shadow-sm"
              />
            </div>

            <div>
              <Label htmlFor="kode_part">Kode Part</Label>
              <div className='mt-2 text-white shadow-lg shadow-cyan-500/50 rounded-xl'>
                <DropdownMenu
                  options={products.map((product) => ({
                    label: `${product.KODE_PART} - ${product.NAMA_PART}`,
                    onClick: () => {
                      setForm((prev) => ({ ...prev, kode_part: product.KODE_PART }));
                    },
                    Icon:
                      form.kode_part === product.KODE_PART ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : null,
                  }))}
                >
                  {form.kode_part
                    ? `${form.kode_part} - ${products.find((p) => p.KODE_PART === form.kode_part)?.NAMA_PART || ""
                    }`
                    : "Pilih Kode Part"}
                </DropdownMenu>
              </div>
            </div>

            <div>
              <Label htmlFor="month">Bulan</Label>
              <div className="mt-2 w-full text-white shadow-lg shadow-cyan-500/50 rounded-xl">
                <DropdownMenu
                  options={[
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                  ].map((month) => ({
                    label: month,
                    onClick: () => {
                      setForm((prev) => ({ ...prev, month }));
                    },
                    Icon: form.month === month ? <Check className="h-4 w-4 text-green-500" /> : null,
                  }))}
                >
                  {form.month || "Pilih Bulan"}
                </DropdownMenu>
              </div>
            </div>

            <div>
              <Label htmlFor="year">Tahun</Label>
              <Input
                type="number"
                id="year"
                name="year"
                required
                value={form.year}
                onChange={handleChange}
                className="mt-2 shadow-cyan-500/50 rounded-xl border-b-4 inset-shadow-sm"
                min="2024"
              />
            </div>

            <div>
              <Label htmlFor="stock_lalu">Stock Lalu</Label>
              <Input
                type="number"
                id="stock_lalu"
                name="stock_lalu"
                value={form.stock_lalu}
                onChange={handleChange}
                className="mt-2 shadow-cyan-500/50 rounded-xl border-b-4 inset-shadow-sm"
              />
            </div>

            <div>
              <Label htmlFor="stock_akhir">Stock Akhir</Label>
              <Input
                type="number"
                id="stock_akhir"
                name="stock_akhir"
                required
                value={form.stock_akhir}
                onChange={handleChange}
                className="mt-2 shadow-cyan-500/50 rounded-xl border-b-4 inset-shadow-sm"
              />
            </div>

            <div>
              <Label htmlFor="stock_minimum">Stock Minimum</Label>
              <Input
                type="number"
                id="stock_minimum"
                name="stock_minimum"
                required
                value={form.stock_minimum}
                onChange={handleChange}
                className="mt-2 shadow-cyan-500/50 rounded-xl border-b-4 inset-shadow-sm"
              />
            </div>

            <div>
              <Label htmlFor="stock_maximum">Stock Maximum</Label>
              <Input
                type="number"
                id="stock_maximum"
                name="stock_maximum"
                required
                value={form.stock_maximum}
                onChange={handleChange}
                className="mt-2 shadow-cyan-500/50 rounded-xl border-b-4 inset-shadow-sm"
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
              Buat Production Plan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
