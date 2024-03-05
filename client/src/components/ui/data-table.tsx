/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import {
  ChevronDownIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { pageSizeOptions } from "@/lib/utils";
import { Link } from "react-router-dom";

interface DataTableProps {
  data: any[];
  columns: ColumnDef<any>[];
  searchShow?: boolean;
  columnsShow?: boolean;
  showAdd?: boolean;
}

export default function DataTable({
  data,
  columns,
  searchShow = true,
  columnsShow = true,
  showAdd = false,
}: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [filtering, setFiltering] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: filtering,
    },
    onGlobalFilterChange: setFiltering,
  });

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center justify-between gap-4 py-4">
        {searchShow && (
          <Input
            placeholder="Search..."
            value={filtering}
            onChange={(event) => setFiltering(event.target.value)}
            className="max-w-sm"
          />
        )}

        {columnsShow && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDownIcon className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }>
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {showAdd && (
          <Link to={"/proposal"} className={buttonVariants()}>
            Add Proposal
          </Link>
        )}
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="text-nowrap">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className="text-left">
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
                {/* <TableHead className="text-center">View</TableHead>
                <TableHead className="text-center">Edit</TableHead>
                <TableHead className="text-center">Delete</TableHead> */}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="text-nowrap">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-left text-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  {/* <TableCell>
                    <Button
                      variant={"outline"}
                      className="text-whatsappGreen hover:text-whatsappGreenDark"
                      onClick={handleViewModal}
                    >
                      <EyeIcon />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={"outline"}
                      className="text-bluePrimary hover:text-bluePrimaryDark"
                      onClick={handleEditModal}
                    >
                      <EditIcon />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={"outline"}
                      className="text-airbnbRed hover:text-airbnbRedDark"
                      onClick={handleDeleteModal}
                    >
                      <TrashIcon />
                    </Button>
                  </TableCell> */}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-3 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {(table.options.state.pagination?.pageSize || 0) *
            ((table.options.state.pagination?.pageIndex || 0) + 1)}{" "}
          of {table.getFilteredRowModel().rows.length} row(s).
        </div>
        <div className="flex items-center text-xs">
          <span className="mr-2 text-gray-500 text-nowrap">Rows Per Page</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"}>
                {table.options.state.pagination?.pageSize}{" "}
                <ChevronDownIcon className="w-4 h-4 ml-2" />{" "}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {pageSizeOptions.map((option, index) => (
                <DropdownMenuCheckboxItem
                  key={index}
                  checked={table.options.state.pagination?.pageSize === option}
                  onCheckedChange={() => table.setPageSize(option)}>
                  {option}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}>
          <ChevronsLeftIcon />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}>
          Next
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}>
          <ChevronsRightIcon />
        </Button>
      </div>
    </div>
  );
}
