'use client';
//biar bisa deploy

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from '@/lib/data';

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
        <h3 className="text-2xl font-semibold text-foreground">Buat Production Plan</h3>
        
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
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="kode_part">Kode Part</Label>
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
            </div>

            <div>
              <Label htmlFor="month">Bulan</Label>
              <select
                id="month"
                name="month"
                required
                value={form.month}
                onChange={handleChange}
                className="w-full rounded-md border border-input px-3 py-2 mt-2"
              >
                <option value="">Pilih Bulan</option>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </select>
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
                className="mt-2"
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
                className="mt-2"
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
                className="mt-2"
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
                className="mt-2"
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
              Buat Production Plan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
