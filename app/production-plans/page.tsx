'use client';
//biar bisa deploy

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductionPlan } from '@/lib/data';
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

export default function ProductionPlansPage() {
  const router = useRouter();
  const [productionPlans, setProductionPlans] = useState<ProductionPlan[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem('productionPlans');
    if (saved) {
      setProductionPlans(JSON.parse(saved));
    }
  }, []);

  const filteredPlans = productionPlans.filter(plan =>
    plan.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.kode_part.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Production Plans</h1>
        <Button onClick={() => router.push('/production-plans/create')}>
          Buat Production Plan
        </Button>
      </div>
      
      <div className="flex items-center py-4">
        <Input
          placeholder="Cari production plan..."
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
              <TableHead>Month/Year</TableHead>
              <TableHead>Stock Akhir</TableHead>
              <TableHead>Stock Min/Max</TableHead>
              <TableHead>Total PO</TableHead>
              <TableHead>Total WO</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell>{plan.company}</TableCell>
                <TableCell>{plan.kode_part}</TableCell>
                <TableCell>{plan.month} {plan.year}</TableCell>
                <TableCell>{plan.stock_akhir}</TableCell>
                <TableCell>{plan.stock_minimum}/{plan.stock_maximum}</TableCell>
                <TableCell>{plan.total_product_order || 0}</TableCell>
                <TableCell>{plan.total_work_order || 0}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" 
                      onClick={() => router.push(`/production-plans/${plan.id}`)}>
                      Detail
                    </Button>
                    <Button variant="outline" size="sm"
                      onClick={() => router.push(`/po/create?production_plan_id=${plan.id}`)}>
                      Buat PO
                    </Button>
                    <Button variant="outline" size="sm"
                      onClick={() => router.push(`/work-orders/create?production_plan_id=${plan.id}`)}>
                      Buat WO
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/work-order-plans/create?production_plan_id=${plan.id}`)}
                    >
                      Buat Plan
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
