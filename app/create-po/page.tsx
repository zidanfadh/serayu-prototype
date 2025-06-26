'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreatePOPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    perusahaan: '',
    jumlahRanjang: 0,
    beratTotalKg: 0,
    catatan: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'jumlahRajang' || name === 'beratTotalKg' ? Number(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPO = {
      id: uuidv4(),
      ...form,
      status: 'On progress',
      date: new Date().toISOString(),
    };

    const existingPOs = JSON.parse(localStorage.getItem('poList') || '[]');
    localStorage.setItem('poList', JSON.stringify([...existingPOs, newPO]));

    router.push('/dashboard');
  };

  return (
    <div className="flex items-center justify-center p-10">
      <div className="sm:mx-auto sm:max-w-2xl w-full">
        <h3 className="text-2xl font-semibold text-foreground">Buat PO Baru</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Lengkapi data berikut untuk membuat Pre-Order
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="col-span-full">
              <Label htmlFor="perusahaan" className="text-sm font-medium text-foreground">
                Nama Perusahaan <span className="text-red-500">*</span>
              </Label>
              <Input
                id="perusahaan"
                name="perusahaan"
                placeholder="Masukkan nama perusahaan"
                required
                value={form.perusahaan}
                onChange={handleChange}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="jumlahRajang" className="text-sm font-medium text-foreground">
                Jumlah Rajang
              </Label>
              <Input
                type="number"
                id="jumlahRanjang"
                name="jumlahRanjang"
                value={form.jumlahRanjang}
                onChange={handleChange}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="beratTotalKg" className="text-sm font-medium text-foreground">
                Berat Total (kg)
              </Label>
              <Input
                type="number"
                id="beratTotalKg"
                name="beratTotalKg"
                value={form.beratTotalKg}
                onChange={handleChange}
                className="mt-2"
              />
            </div>

            <div className="col-span-full">
              <Label htmlFor="catatan" className="text-sm font-medium text-foreground">
                Catatan
              </Label>
              <textarea
                id="catatan"
                name="catatan"
                rows={4}
                placeholder="Tuliskan catatan tambahan jika ada"
                value={form.catatan}
                onChange={handleChange}
                className="w-full rounded-md border border-input px-3 py-2 mt-2 text-base shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          {/* Manual Separator */}
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
  <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
    Buat PO
  </div>
</button>
          </div>
        </form>
      </div>
    </div>
  );
}
