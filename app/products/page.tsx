'use client';
//biar bisa deploy


import { useEffect, useState } from 'react';
import { Product } from '@/lib/data';
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
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Sample initial data to populate if localStorage is empty
const sampleProductData: Product[] = [
  {
    "NO": 4,
    "KODE_PART": "A4",
    "No_PART": "AQ3G344F0",
    "NAMA_PART": "CLAMP",
    "SPEC": "SPCCT / SPCC-SD",
    "TEBAL": 1.6,
    "PNJANG_SHEET": 2438,
    "LEBAR_SHEET": 1219,
    "TYPE_MTRL": "SHEET",
    "LEBAR_SHEARG": 95,
    "TOL": "± 1",
    "LANGKAH_PITCH": 24,
    "LANGKAH_CAV": 1,
    "JUMLAH_PCS_PER_LBR": 1250,
    "BERAT_per_LEMBAR": 37.33,
    "JUMLAH_Rjg_per_Lbr": 25.00,
    "JUMLAH_Pcs_per_Rjg": 50,
    "BERAT_per_RAJANG": 1.45,
    "BRUTTO": 33.5,
    "pcs_per_kg": 0.029
  },
  {
    "NO": 5,
    "KODE_PART": "A5",
    "No_PART": "AQ3E089F0",
    "NAMA_PART": "CLAMP",
    "SPEC": "SPCCT / SPCC-SD",
    "TEBAL": 1.6,
    "PNJANG_SHEET": 2438,
    "LEBAR_SHEET": 1219,
    "TYPE_MTRL": "SHEET",
    "LEBAR_SHEARG": 153,
    "TOL": "± 1",
    "LANGKAH_PITCH": 33,
    "LANGKAH_CAV": 1,
    "JUMLAH_PCS_PER_LBR": 540,
    "BERAT_per_LEMBAR": 37.33,
    "JUMLAH_Rjg_per_Lbr": 15.00,
    "JUMLAH_Pcs_per_Rjg": 36,
    "BERAT_per_RAJANG": 2.34,
    "BRUTTO": 14.5,
    "pcs_per_kg": 0.063
  },
  {
    "NO": 6,
    "KODE_PART": "A6",
    "No_PART": "AQ3E090F0",
    "NAMA_PART": "CLAMP",
    "SPEC": "SPCCT / SPCC-SD",
    "TEBAL": 1.6,
    "PNJANG_SHEET": 2438,
    "LEBAR_SHEET": 1219,
    "TYPE_MTRL": "SHEET",
    "LEBAR_SHEARG": 153,
    "TOL": "± 1",
    "LANGKAH_PITCH": 33,
    "LANGKAH_CAV": 1,
    "JUMLAH_PCS_PER_LBR": 540,
    "BERAT_per_LEMBAR": 37.33,
    "JUMLAH_Rjg_per_Lbr": 15.00,
    "JUMLAH_Pcs_per_Rjg": 36,
    "BERAT_per_RAJANG": 2.34,
    "BRUTTO": 14.5,
    "pcs_per_kg": 0.063
  },
  {
    "NO": 7,
    "KODE_PART": "A7",
    "No_PART": "AQ3E094F0",
    "NAMA_PART": "CLAMP",
    "SPEC": "SPCCT / SPCC-SD",
    "TEBAL": 1.6,
    "PNJANG_SHEET": 2438,
    "LEBAR_SHEET": 1219,
    "TYPE_MTRL": "SHEET",
    "LEBAR_SHEARG": 110,
    "TOL": "± 1",
    "LANGKAH_PITCH": 64,
    "LANGKAH_CAV": 2,
    "JUMLAH_PCS_PER_LBR": 836,
    "BERAT_per_LEMBAR": 37.33,
    "JUMLAH_Rjg_per_Lbr": 22.00,
    "JUMLAH_Pcs_per_Rjg": 38,
    "BERAT_per_RAJANG": 1.68,
    "BRUTTO": 22.4,
    "pcs_per_kg": 0.044
  }
];

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize or load products from localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem('productList');
    if (!savedProducts || JSON.parse(savedProducts).length === 0) {
      // Initialize with sample data if empty
      localStorage.setItem('productList', JSON.stringify(sampleProductData));
      setProducts(sampleProductData);
    } else {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  // Navigate to product detail
  const handleRowClick = (kodepart: string) => {
    router.push(`/products/${kodepart}`);
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'KODE_PART',
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
      accessorKey: 'No_PART',
      header: 'No Part',
    },
    {
      accessorKey: 'NAMA_PART',
      header: 'Nama Part',
    },
    {
      accessorKey: 'SPEC',
      header: 'Spesifikasi',
    },
    {
      accessorKey: 'TEBAL',
      header: 'Tebal',
      cell: ({ row }) => <div>{row.getValue("TEBAL")} mm</div>,
    },
    {
        accessorKey: 'PNJANG_SHEET',
        header: 'Panjang Sheet',
        cell: ({ row }) => <div>{row.getValue("PNJANG_SHEET")} mm</div>,
    },
    {
      accessorKey: 'LEBAR_SHEET',
      header: 'Lebar Sheet',    
        cell: ({ row }) => <div>{row.getValue("LEBAR_SHEET")} mm</div>,
    },
    {
      accessorKey: 'JUMLAH_PCS_PER_LBR',
      header: 'Pcs/Lembar',
    },
    {
      accessorKey: 'BERAT_per_LEMBAR',
      header: 'Berat/Lembar',
      cell: ({ row }) => <div>{row.getValue("BERAT_per_LEMBAR")} kg</div>,
    },
    {
      accessorKey: 'JUMLAH_Rjg_per_Lbr',
      header: 'Rjg/Lembar',
    },
  ];

  // Create a multi-column filter function
  const filterFunction = (row: any) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const searchableFields = ['KODE_PART', 'No_PART', 'NAMA_PART', 'SPEC'];
    
    return searchableFields.some(field => 
      String(row[field]).toLowerCase().includes(query)
    );
  };

  // Apply the custom filter function to the data
  const filteredData = searchQuery 
    ? products.filter(filterFunction) 
    : products;

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
        <h1 className="text-2xl font-bold mb-6">Daftar Produk</h1>
        
        <div className="flex items-center py-4">
            <Input
            placeholder="Cari produk..."
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
                    onClick={() => handleRowClick(row.original.KODE_PART)}
                    className="cursor-pointer hover:bg-muted/50"
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
                    Tidak ada data produk
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
