'use client';
//biar bisa deploy

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PO } from '@/lib/data';
import { Button2 } from "@/components/ui/moving-border";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function POPage() {
  const router = useRouter();
  const [poList, setPOList] = useState<PO[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem('poList');
    if (saved) {
      setPOList(JSON.parse(saved));
    }
  }, []);

  const filteredPOs = poList.filter(po =>
    po.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    po.kode_part.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Purchase Orders</h1>
        <Button2 className='cursor-pointer shadow-lg' onClick={() => router.push('/po/create')}>
          + Purchase Order
        </Button2>
      </div>
      
      <div className="flex items-center py-4">
        <Input
          placeholder="Cari PO..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Kode Part</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPOs.map((po) => (
              <TableRow key={po.id}>
                <TableCell>{po.company}</TableCell>
                <TableCell>{po.kode_part}</TableCell>
                <TableCell>{po.quantity}</TableCell>
                <TableCell>{new Date(po.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" 
                    onClick={() => router.push(`/po/${po.id}`)}>
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
