'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type PO = {
  id: string;
  perusahaan: string;
  jumlahRanjang: number;
  beratTotalKg: number;
  catatan: string;
};

export default function PODetail() {
  const { id } = useParams();
  const [po, setPo] = useState<PO | null>(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('poList') || '[]');
    const found = saved.find((item: PO) => item.id === id);
    setPo(found ?? null);
  }, [id]);

  if (!po) return <p>PO tidak ditemukan</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">{po.perusahaan}</h1>
      <p>Jumlah Ranjang: {po.jumlahRanjang}</p>
      <p>Berat Total: {po.beratTotalKg} kg</p>
      <p>Catatan: {po.catatan}</p>
    </div>
  );
}
