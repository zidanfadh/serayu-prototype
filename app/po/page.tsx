'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PO } from '@/lib/data';
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
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Purchase Orders</h1>
        <Button onClick={() => router.push('/po/create')}>
          Buat PO
        </Button>
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