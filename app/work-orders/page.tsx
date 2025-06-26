'use client';
//biar bisa deploy

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorkOrder, ProductionPlan } from '@/lib/data';
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
import { ArrowUpDown } from 'lucide-react';

export default function WorkOrdersPage() {
  const router = useRouter();
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [productionPlans, setProductionPlans] = useState<ProductionPlan[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Load work orders
    const savedWorkOrders = localStorage.getItem('workOrdersList');
    if (savedWorkOrders) {
      setWorkOrders(JSON.parse(savedWorkOrders));
    }

    // Load production plans for company lookup
    const savedPlans = localStorage.getItem('productionPlans');
    if (savedPlans) {
      setProductionPlans(JSON.parse(savedPlans));
    }
  }, []);

  // Function to get company name from production plan
  const getCompanyName = (productionPlanId: string) => {
    const plan = productionPlans.find(p => p.id === productionPlanId);
    return plan?.company || '-';
  };

  const columns: ColumnDef<WorkOrder>[] = [
    {
      accessorKey: 'kode_part',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Kode Part
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity',
      cell: ({ row }) => <div>{row.getValue("quantity")} pcs</div>,
    },
    {
      id: 'company',
      header: 'Company',
      cell: ({ row }) => <div>{getCompanyName(row.original.production_plan_id)}</div>,
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return <div>{date.toLocaleDateString('id-ID')}</div>;
      },
    },
    {
      accessorKey: 'updated_at',
      header: 'Updated At',
      cell: ({ row }) => {
        const date = new Date(row.getValue("updated_at"));
        return <div>{date.toLocaleDateString('id-ID')}</div>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push(`/work-orders/${row.original.id}`)}
          >
            Detail
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push(`/work-order-plans/create?production_plan_id=${row.original.production_plan_id}`)}
          >
            Buat Plan
          </Button>
        </div>
      ),
    },
  ];

  // Create a multi-column filter function
  const filterFunction = (row: WorkOrder) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const company = getCompanyName(row.production_plan_id).toLowerCase();
    const searchableFields = [
      row.kode_part.toLowerCase(),
      row.quantity.toLowerCase(),
      company
    ];
    
    return searchableFields.some(field => 
      field.includes(query)
    );
  };

  // Apply the custom filter function to the data
  const filteredData = searchQuery 
    ? workOrders.filter(filterFunction) 
    : workOrders;

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
    <div className="flex justify-center-safe item-center py-10 mx-10">
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Work Orders</h1>
          <Button onClick={() => router.push('/work-orders/create')}>
            Buat Work Order
          </Button>
        </div>
        
        <div className="flex items-center py-4">
          <Input
            placeholder="Cari work order..."
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
                    Tidak ada data work order
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
    </div>
  );
}
