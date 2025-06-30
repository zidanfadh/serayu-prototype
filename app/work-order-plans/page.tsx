'use client';
//biar bisa deploy

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorkOrderPlan } from '@/lib/data';
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

export default function WorkOrderPlansPage() {
  const router = useRouter();
  const [workOrderPlans, setWorkOrderPlans] = useState<WorkOrderPlan[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem('workOrderPlans');
    if (saved) {
      setWorkOrderPlans(JSON.parse(saved));
    }
  }, []);

  const filteredPlans = workOrderPlans.filter(plan =>
    plan.product.kode_part.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.product.nama_part.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Work Order Plans</h1>
      </div>
      
      <div className="flex items-center py-4">
        <Input
          placeholder="Cari work order plan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode Part</TableHead>
              <TableHead>Nama Part</TableHead>
              <TableHead>Week</TableHead>
              <TableHead>Month/Year</TableHead>
              <TableHead>Material (Rjg)</TableHead>
              <TableHead>Start Production</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell>{plan.product.kode_part}</TableCell>
                <TableCell>{plan.product.nama_part}</TableCell>
                <TableCell>{plan.week_number}</TableCell>
                <TableCell>{plan.month} {plan.year}</TableCell>
                <TableCell>{plan.order_material_rjg}</TableCell>
                <TableCell>
                  {plan.start_production_date ? new Date(plan.start_production_date).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell>
                  {plan.deadline_date ? new Date(plan.deadline_date).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" 
                    onClick={() => router.push(`/work-order-plans/${plan.id}`)}>
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
