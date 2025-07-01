'use client';
//biar bisa deploy

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorkOrdersReport } from '@/lib/data';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Button2 } from "@/components/ui/moving-border";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { ArrowUpDown, FileText, Eye } from 'lucide-react';

export default function WorkOrderReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState<WorkOrdersReport[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const savedReports = localStorage.getItem('workOrdersReportList');
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    }
  }, []);

  const columns: ColumnDef<WorkOrdersReport>[] = [
    {
      accessorKey: 'week_number',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Week
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>Week {row.getValue("week_number")}</div>,
    },
    {
      accessorKey: 'month',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Month
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'year',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Year
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'start_date',
      header: 'Start Date',
      cell: ({ row }) => {
        const date = new Date(row.getValue("start_date"));
        return <div>{date.toLocaleDateString('id-ID')}</div>;
      },
    },
    {
      accessorKey: 'end_date',
      header: 'End Date',
      cell: ({ row }) => {
        const date = new Date(row.getValue("end_date"));
        return <div>{date.toLocaleDateString('id-ID')}</div>;
      },
    },
    {
      id: 'work_order_plans_count',
      header: 'Total Plans',
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.work_order_plans.length} plans
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push(`/work-order-reports/${row.original.id}`)}
            className="flex items-center gap-1 cursor-pointer"
          >
            <Eye className="h-4 w-4" />
            View Report
          </Button>
        </div>
      ),
    },
  ];

  // Filter function
  const filterFunction = (row: WorkOrdersReport) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const searchableFields = [
      row.month.toLowerCase(),
      row.year.toString(),
      `week ${row.week_number}`,
    ];
    
    return searchableFields.some(field => 
      field.includes(query)
    );
  };

  const filteredData = searchQuery 
    ? reports.filter(filterFunction) 
    : reports;

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Work Order Reports</h1>
          <p className="text-muted-foreground">Laporan work order plans berdasarkan periode</p>
        </div>
        <Button2 
          onClick={() => router.push('/work-order-reports/create')}
          className="cursor-pointer shadow-lg"
        >
          <FileText className="h-4 w-4 mx-2" />
          Generate Report
        </Button2>
      </div>
      
      <div className="flex items-center py-4">
        <Input
          placeholder="Cari report (bulan, tahun, week)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Belum ada report yang dibuat
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Sebelumnya
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Selanjutnya
        </Button>
      </div>
    </div>
  );
}
