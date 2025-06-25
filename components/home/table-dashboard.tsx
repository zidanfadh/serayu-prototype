"use client";

import { cn } from "@/lib/utils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
    ColumnFiltersState,
    FilterFn,
    PaginationState,
    Row,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    ChevronDown,
    ChevronFirst,
    ChevronLast,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    CircleAlert,
    CircleX,
    Columns3,
    Ellipsis,
    Filter,
    ListFilter,
    Plus,
    Trash,
} from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeSwitch } from "../ui/theme-switch-button";
import { RainbowButton } from "../ui/rainbow-button";

type Item = {
    id: string;
    perusahaan: string;
    jumlahRanjang: number;
    beratTotalKg: number;
    catatan: string;
    status: "On progress" | "Complete";
    date: string;
};

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<Item> = (row, columnId, filterValue) => {
    const searchableRowContent = `${row.original.perusahaan} ${row.original.date}`.toLowerCase();
    const searchTerm = (filterValue ?? "").toLowerCase();
    return searchableRowContent.includes(searchTerm);
};

const statusFilterFn: FilterFn<Item> = (row, columnId, filterValue: string[]) => {
    if (!filterValue?.length) return true;
    const status = row.getValue(columnId) as string;
    return filterValue.includes(status);
};

const columns: ColumnDef<Item>[] = [
    {
        accessorKey: 'perusahaan',
        header: 'Perusahaan',
        cell: ({ row }) => <div className="font-medium">{row.getValue("perusahaan")}</div>,
    },
    {
        accessorKey: 'jumlahRanjang',
        header: 'Jumlah Ranjang',
        cell: ({ row }) => <div>{row.getValue("jumlahRanjang")} ranjang</div>,
    },
    {
        accessorKey: 'beratTotalKg',
        header: 'Berat (kg)',
        cell: ({ row }) => <div>{row.getValue("beratTotalKg")} kg</div>,
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            const isComplete = status === "Complete";
            return (
                <Badge className={isComplete ? "bg-green-500" : "bg-yellow-500"}>
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'date',
        header: 'Tanggal',
        cell: ({ row }) => {
            const dateStr = row.getValue("date") as string;
            const date = new Date(dateStr);
            return <div>{date.toLocaleDateString("id-ID")}</div>;
        },
    },
];

export default function Component() {
    const router = useRouter();
    const id = useId();
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const inputRef = useRef<HTMLInputElement>(null);

    const [sorting, setSorting] = useState<SortingState>([
        {
            id: "perusahaan",
            desc: false,
        },
    ]);

    const [data, setData] = useState<Item[]>([]);
    useEffect(() => {
        const stored = localStorage.getItem("poList");
        const parsed = stored ? JSON.parse(stored) : [];
        setData(parsed);
    }, []);

    const handleDeleteRows = () => {
        const selectedRows = table.getSelectedRowModel().rows;
        const updatedData = data.filter(
            (item) => !selectedRows.some((row) => row.original.id === item.id),
        );
        setData(updatedData);
        table.resetRowSelection();
    };

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        enableSortingRemoval: false,
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        state: {
            sorting,
            pagination,
            columnFilters,
            columnVisibility,
        },
    });

    // Get unique status values
    const uniqueStatusValues = useMemo(() => {
        const statusColumn = table.getColumn("status");

        if (!statusColumn) return [];

        const values = Array.from(statusColumn.getFacetedUniqueValues().keys());

        return values.sort();
    }, [table.getColumn("status")?.getFacetedUniqueValues()]);

    // Get counts for each status
    const statusCounts = useMemo(() => {
        const statusColumn = table.getColumn("status");
        if (!statusColumn) return new Map();
        return statusColumn.getFacetedUniqueValues();
    }, [table.getColumn("status")?.getFacetedUniqueValues()]);

    const selectedStatuses = useMemo(() => {
        const filterValue = table.getColumn("status")?.getFilterValue() as string[];
        return filterValue ?? [];
    }, [table.getColumn("status")?.getFilterValue()]);

    const handleStatusChange = (checked: boolean, value: string) => {
        const filterValue = table.getColumn("status")?.getFilterValue() as string[];
        const newFilterValue = filterValue ? [...filterValue] : [];

        if (checked) {
            newFilterValue.push(value);
        } else {
            const index = newFilterValue.indexOf(value);
            if (index > -1) {
                newFilterValue.splice(index, 1);
            }
        }

        table.getColumn("status")?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
    };

    return (
        <div className="space-y-4 max-w-[1000px]">
            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    {/* Filter by name or email */}
                    <div className="relative">
                        <Input
                            id={`${id}-input`}
                            ref={inputRef}
                            className={cn(
                                "peer min-w-60 ps-9",
                                Boolean(table.getColumn("perusahaan")?.getFilterValue()) && "pe-9",
                            )}
                            value={(table.getColumn("perusahaan")?.getFilterValue() ?? "") as string}
                            onChange={(e) => table.getColumn("perusahaan")?.setFilterValue(e.target.value)}
                            placeholder="Filter by Perusahaan"
                            type="text"
                            aria-label="Filter by name or email"
                        />
                        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                            <ListFilter size={16} strokeWidth={2} aria-hidden="true" />
                        </div>
                        {Boolean(table.getColumn("perusahaan")?.getFilterValue()) && (
                            <button
                                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label="Clear filter"
                                onClick={() => {
                                    table.getColumn("perusahaan")?.setFilterValue("");
                                    if (inputRef.current) {
                                        inputRef.current.focus();
                                    }
                                }}
                            >
                                <CircleX size={16} strokeWidth={2} aria-hidden="true" />
                            </button>
                        )}
                    </div>
                    {/* Filter by status */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline">
                                <Filter
                                    className="-ms-1 me-2 opacity-60"
                                    size={16}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                />
                                Status
                                {selectedStatuses.length > 0 && (
                                    <span className="-me-1 ms-3 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                                        {selectedStatuses.length}
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="min-w-36 p-3" align="start">
                            <div className="space-y-3">
                                <div className="text-xs font-medium text-muted-foreground">Filters</div>
                                <div className="space-y-3">
                                    {uniqueStatusValues.map((value, i) => (
                                        <div key={value} className="flex items-center gap-2">
                                            <Checkbox
                                                id={`${id}-${i}`}
                                                checked={selectedStatuses.includes(value)}
                                                onCheckedChange={(checked: boolean) => handleStatusChange(checked, value)}
                                            />
                                            <Label
                                                htmlFor={`${id}-${i}`}
                                                className="flex grow justify-between gap-2 font-normal"
                                            >
                                                {value}{" "}
                                                <span className="ms-2 text-xs text-muted-foreground">
                                                    {statusCounts.get(value)}
                                                </span>
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                    {/* Toggle columns visibility */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Columns3
                                    className="-ms-1 me-2 opacity-60"
                                    size={16}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                />
                                View
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                            onSelect={(event) => event.preventDefault()}
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="flex items-center gap-3">
                    {/* Delete button */}
                    {table.getSelectedRowModel().rows.length > 0 && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className="ml-auto" variant="outline">
                                    <Trash
                                        className="-ms-1 me-2 opacity-60"
                                        size={16}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />
                                    Delete
                                    <span className="-me-1 ms-3 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                                        {table.getSelectedRowModel().rows.length}
                                    </span>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                                    <div
                                        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
                                        aria-hidden="true"
                                    >
                                        <CircleAlert className="opacity-80" size={16} strokeWidth={2} />
                                    </div>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete{" "}
                                            {table.getSelectedRowModel().rows.length} selected{" "}
                                            {table.getSelectedRowModel().rows.length === 1 ? "row" : "rows"}.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                </div>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteRows}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                    <ThemeSwitch />
                    <Link href="/create-po">
                    <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
    Tambah PO
  </span>
</button>
                        
                    </Link>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg border border-border bg-background">
                <Table className="table-fixed">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            style={{ width: `${header.getSize()}px` }}
                                            className="h-11"
                                        >
                                            {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                                <div
                                                    className={cn(
                                                        header.column.getCanSort() &&
                                                        "flex h-full cursor-pointer select-none items-center justify-between gap-2",
                                                    )}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                    onKeyDown={(e) => {
                                                        // Enhanced keyboard handling for sorting
                                                        if (
                                                            header.column.getCanSort() &&
                                                            (e.key === "Enter" || e.key === " ")
                                                        ) {
                                                            e.preventDefault();
                                                            header.column.getToggleSortingHandler()?.(e);
                                                        }
                                                    }}
                                                    tabIndex={header.column.getCanSort() ? 0 : undefined}
                                                >
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {{
                                                        asc: (
                                                            <ChevronUp
                                                                className="shrink-0 opacity-60"
                                                                size={16}
                                                                strokeWidth={2}
                                                                aria-hidden="true"
                                                            />
                                                        ),
                                                        desc: (
                                                            <ChevronDown
                                                                className="shrink-0 opacity-60"
                                                                size={16}
                                                                strokeWidth={2}
                                                                aria-hidden="true"
                                                            />
                                                        ),
                                                    }[header.column.getIsSorted() as string] ?? null}
                                                </div>
                                            ) : (
                                                flexRender(header.column.columnDef.header, header.getContext())
                                            )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="cursor-pointer hover:bg-accent"
                                    onClick={() => router.push(`/po/${row.original.id}`)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="last:py-0">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between gap-8">
                {/* Results per page */}
                <div className="flex items-center gap-3">
                    <Label htmlFor={id} className="max-sm:sr-only">
                        Rows per page
                    </Label>
                    <Select
                        value={table.getState().pagination.pageSize.toString()}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value));
                        }}
                    >
                        <SelectTrigger id={id} className="w-fit whitespace-nowrap">
                            <SelectValue placeholder="Select number of results" />
                        </SelectTrigger>
                        <SelectContent className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
                            {[5, 10, 25, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={pageSize.toString()}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {/* Page number information */}
                <div className="flex grow justify-end whitespace-nowrap text-sm text-muted-foreground">
                    <p className="whitespace-nowrap text-sm text-muted-foreground" aria-live="polite">
                        <span className="text-foreground">
                            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
                            {Math.min(
                                Math.max(
                                    table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
                                    table.getState().pagination.pageSize,
                                    0,
                                ),
                                table.getRowCount(),
                            )}
                        </span>{" "}
                        of <span className="text-foreground">{table.getRowCount().toString()}</span>
                    </p>
                </div>

                {/* Pagination buttons */}
                <div>
                    <Pagination>
                        <PaginationContent>
                            {/* First page button */}
                            <PaginationItem>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="disabled:pointer-events-none disabled:opacity-50"
                                    onClick={() => table.firstPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    aria-label="Go to first page"
                                >
                                    <ChevronFirst size={16} strokeWidth={2} aria-hidden="true" />
                                </Button>
                            </PaginationItem>
                            {/* Previous page button */}
                            <PaginationItem>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="disabled:pointer-events-none disabled:opacity-50"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    aria-label="Go to previous page"
                                >
                                    <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
                                </Button>
                            </PaginationItem>
                            {/* Next page button */}
                            <PaginationItem>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="disabled:pointer-events-none disabled:opacity-50"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    aria-label="Go to next page"
                                >
                                    <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
                                </Button>
                            </PaginationItem>
                            {/* Last page button */}
                            <PaginationItem>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="disabled:pointer-events-none disabled:opacity-50"
                                    onClick={() => table.lastPage()}
                                    disabled={!table.getCanNextPage()}
                                    aria-label="Go to last page"
                                >
                                    <ChevronLast size={16} strokeWidth={2} aria-hidden="true" />
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
                PT. Serayu

            </p>
        </div>
    );
}

function RowActions({ row }: { row: Row<Item> }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex justify-end">
                    <Button size="icon" variant="ghost" className="shadow-none" aria-label="Edit item">
                        <Ellipsis size={16} strokeWidth={2} aria-hidden="true" />
                    </Button>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <span>Edit</span>
                        <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <span>Duplicate</span>
                        <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <span>Archive</span>
                        <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem>Move to project</DropdownMenuItem>
                                <DropdownMenuItem>Move to folder</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Advanced options</DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>Share</DropdownMenuItem>
                    <DropdownMenuItem>Add to favorites</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                    <span>Delete</span>
                    <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export { Component }