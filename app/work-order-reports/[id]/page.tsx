'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { WorkOrdersReport, WorkOrderPlan } from '@/lib/data';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, Package, FileText, Eye } from 'lucide-react';

export default function WorkOrderReportDetailPage() {
  const router = useRouter();
  const params = useParams();
  const reportId = params.id as string;
  
  const [report, setReport] = useState<WorkOrdersReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedReports = localStorage.getItem('workOrdersReportList');
    if (savedReports) {
      const reports = JSON.parse(savedReports);
      const foundReport = reports.find((r: WorkOrdersReport) => r.id === reportId);
      setReport(foundReport || null);
    }
    setLoading(false);
  }, [reportId]);

  const handlePlanClick = (planId: string) => {
    router.push(`/work-order-plans/${planId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4">Loading report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Report Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested report could not be found.</p>
          <Button onClick={() => router.push('/work-order-reports')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Button>
        </div>
      </div>
    );
  }

  // Calculate summary statistics
  const totalPlans = report.work_order_plans.length;
  const totalMaterialRjg = report.work_order_plans.reduce(
    (sum, plan) => sum + (plan.order_material_rjg || 0), 0
  );
  const totalMaterialKg = report.work_order_plans.reduce(
    (sum, plan) => sum + (plan.order_material_kg || 0), 0
  );

  // Group plans by status or production date
  const plansWithDeadlines = report.work_order_plans.filter(plan => plan.deadline_date);
  const upcomingDeadlines = plansWithDeadlines.filter(plan => {
    const deadline = new Date(plan.deadline_date!);
    const now = new Date();
    const daysDiff = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff >= 0 && daysDiff <= 7; // Next 7 days
  });

  return (
    <div className="container mx-auto py-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push('/work-order-reports')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reports
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            Work Order Report - Week {report.week_number}
          </h1>
          <p className="text-muted-foreground">
            {report.month} {report.year} • {new Date(report.start_date).toLocaleDateString()} - {new Date(report.end_date).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPlans}</div>
            <p className="text-xs text-muted-foreground">work order plans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Material (Rajang)</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMaterialRjg.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">total rajang needed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Material (Kg)</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMaterialKg.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">total kg needed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Deadlines</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{upcomingDeadlines.length}</div>
            <p className="text-xs text-muted-foreground">in next 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Work Order Plans Table */}
      <Card>
        <CardHeader>
          <CardTitle>Work Order Plans Detail</CardTitle>
          <CardDescription>
            All work order plans for Week {report.week_number}, {report.month} {report.year}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode Part</TableHead>
                  <TableHead>Nama Part</TableHead>
                  <TableHead>Material (Rjg)</TableHead>
                  <TableHead>Material (Kg)</TableHead>
                  <TableHead>Start Production</TableHead>
                  <TableHead>End Production</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.work_order_plans.map((plan) => {
                  const isUrgent = plan.deadline_date && upcomingDeadlines.some(p => p.id === plan.id);
                  
                  return (
                    <TableRow 
                      key={plan.id} 
                      className={`hover:bg-muted/50 cursor-pointer ${isUrgent ? 'bg-red-50 hover:bg-red-100' : ''}`}
                      onClick={() => handlePlanClick(plan.id)}
                    >
                      <TableCell className="font-medium">{plan.product.kode_part}</TableCell>
                      <TableCell>{plan.product.nama_part}</TableCell>
                      <TableCell>{plan.order_material_rjg || '-'}</TableCell>
                      <TableCell>{plan.order_material_kg?.toFixed(2) || '-'} kg</TableCell>
                      <TableCell>
                        {plan.start_production_date 
                          ? new Date(plan.start_production_date).toLocaleDateString('id-ID')
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        {plan.end_production_date 
                          ? new Date(plan.end_production_date).toLocaleDateString('id-ID')
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-2 ${isUrgent ? 'text-red-600 font-medium' : ''}`}>
                          {plan.deadline_date 
                            ? new Date(plan.deadline_date).toLocaleDateString('id-ID')
                            : '-'
                          }
                          {isUrgent && <Clock className="h-4 w-4" />}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlanClick(plan.id);
                          }}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {report.work_order_plans.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Tidak ada work order plan untuk periode ini
            </div>
          )}
        </CardContent>
      </Card>

      {/* Urgent Deadlines Alert */}
      {upcomingDeadlines.length > 0 && (
        <Card className="mt-6 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Urgent Deadlines
            </CardTitle>
            <CardDescription className="text-red-600">
              {upcomingDeadlines.length} work order plan(s) have deadlines within the next 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingDeadlines.map((plan) => {
                const deadline = new Date(plan.deadline_date!);
                const daysDiff = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <div 
                    key={plan.id} 
                    className="flex justify-between items-center p-3 bg-white rounded border cursor-pointer hover:bg-gray-50"
                    onClick={() => handlePlanClick(plan.id)}
                  >
                    <div>
                      <p className="font-medium">{plan.product.kode_part} - {plan.product.nama_part}</p>
                      <p className="text-sm text-muted-foreground">
                        Deadline: {deadline.toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        daysDiff === 0 ? 'bg-red-600 text-white' :
                        daysDiff <= 2 ? 'bg-red-500 text-white' :
                        'bg-yellow-500 text-white'
                      }`}>
                        {daysDiff === 0 ? 'Today' : daysDiff === 1 ? 'Tomorrow' : `${daysDiff} days`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}