// filepath: c:\Users\muhfa\Documents\Work\Freelance\ERP\prototype\serayu-prototype\app\work-order-reports\create\page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WorkOrderPlan } from '@/lib/data';
import { FileText, Search } from 'lucide-react';

export function WorkOrderReportPage() {
  const router = useRouter();
  const [workOrderPlans, setWorkOrderPlans] = useState<WorkOrderPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<WorkOrderPlan[]>([]);
  const [form, setForm] = useState({
    week_number: '',
    month: '',
    year: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('workOrderPlans');
    if (saved) {
      setWorkOrderPlans(JSON.parse(saved));
    }
  }, []);

  // Filter work order plans based on form criteria
  useEffect(() => {
    if (form.week_number && form.month && form.year) {
      const filtered = workOrderPlans.filter(plan => 
        plan.week_number === parseInt(form.week_number) &&
        plan.month === form.month &&
        plan.year === form.year
      );
      setFilteredPlans(filtered);
    } else {
      setFilteredPlans([]);
    }
  }, [form.week_number, form.month, form.year, workOrderPlans]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'week_number' ? value : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (filteredPlans.length === 0) {
      alert('Tidak ada work order plan yang ditemukan untuk periode tersebut');
      return;
    }

    const newReport = {
      id: uuidv4(),
      week_number: parseInt(form.week_number),
      month: form.month,
      year: form.year,
      start_date: new Date(form.start_date),
      end_date: new Date(form.end_date),
      work_order_plans: filteredPlans,
    };

    const existing = JSON.parse(localStorage.getItem('workOrdersReportList') || '[]');
    localStorage.setItem('workOrdersReportList', JSON.stringify([...existing, newReport]));

    router.push('/work-order-reports');
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i - 2);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="flex items-center justify-center p-10">
      <div className="sm:mx-auto sm:max-w-4xl w-full">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-6 w-6" />
          <h3 className="text-2xl font-semibold text-foreground">Generate Work Order Report</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-8">
          Pilih periode untuk menghasilkan laporan work order plans
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="week_number" className="text-sm font-medium">
                Week Number <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                id="week_number"
                name="week_number"
                required
                value={form.week_number}
                onChange={handleChange}
                className="mt-2"
                min="1"
                max="52"
                placeholder="1-52"
              />
            </div>

            <div>
              <Label htmlFor="month" className="text-sm font-medium">
                Month <span className="text-red-500">*</span>
              </Label>
              <select
                id="month"
                name="month"
                required
                value={form.month}
                onChange={handleChange}
                className="w-full rounded-md border border-input px-3 py-2 mt-2"
              >
                <option value="">Pilih Bulan</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="year" className="text-sm font-medium">
                Year <span className="text-red-500">*</span>
              </Label>
              <select
                id="year"
                name="year"
                required
                value={form.year}
                onChange={handleChange}
                className="w-full rounded-md border border-input px-3 py-2 mt-2"
              >
                <option value="">Pilih Tahun</option>
                {years.map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="start_date" className="text-sm font-medium">
                Report Start Date <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                id="start_date"
                name="start_date"
                required
                value={form.start_date}
                onChange={handleChange}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="end_date" className="text-sm font-medium">
                Report End Date <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                id="end_date"
                name="end_date"
                required
                value={form.end_date}
                onChange={handleChange}
                className="mt-2"
              />
            </div>
          </div>

          {/* Preview of found work order plans */}
          {form.week_number && form.month && form.year && (
            <div className="bg-muted p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-5 w-5" />
                <h4 className="font-semibold">Preview Work Order Plans</h4>
              </div>
              
              {filteredPlans.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Ditemukan {filteredPlans.length} work order plan(s) untuk Week {form.week_number}, {form.month} {form.year}:
                  </p>
                  <div className="grid gap-2">
                    {filteredPlans.map((plan) => (
                      <div key={plan.id} className="bg-background p-3 rounded border">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{plan.product.kode_part} - {plan.product.nama_part}</p>
                            <p className="text-sm text-muted-foreground">
                              Material: {plan.order_material_rjg} rajang
                            </p>
                          </div>
                          <div className="text-right text-sm">
                            {plan.start_production_date && (
                              <p>Start: {new Date(plan.start_production_date).toLocaleDateString()}</p>
                            )}
                            {plan.deadline_date && (
                              <p>Deadline: {new Date(plan.deadline_date).toLocaleDateString()}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-yellow-600">
                  Tidak ada work order plan yang ditemukan untuk periode tersebut
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Batal
            </Button>
            <Button 
              type="submit"
              disabled={filteredPlans.length === 0}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}