import { createFileRoute } from '@tanstack/react-router'
import {
  useReactTable,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table'
import axios from 'axios'
import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  DollarSign,
  FileText,
  Key,
  UserCheck
} from 'react-feather'

export const Route = createFileRoute('/pending_tickets')({
  component: PendingTickets,
})
interface Reimbursement {
  reimbId: number,
  description: string,
  amount: number,
  status: string,
  userId: number
}
const columnHelper = createColumnHelper<Reimbursement>()

const columns = [
  columnHelper.accessor('reimbId', {
    cell: (info) => info.getValue(),
    header: () => (
      <span className="flex items-center">
        <Key className="mr-2" size={16} />
        ID
      </span>
    ),
  }),
  columnHelper.accessor('description', {
    cell: (info) => info.getValue(),
    header: () => (
      <span className="flex items-center">
        <FileText className="mr-2" size={16} /> Description
      </span>
    ),
  }),
  columnHelper.accessor('amount', {
    cell: (info) => info.getValue(),
    header: () => (
      <span className="flex items-center">
        <DollarSign className="mr-2" size={16} /> Amount
      </span>
    ),
  }),
  columnHelper.accessor('status', {
    cell: (info) => info.getValue(),
    header: () => (
      <span className="flex items-center">
        <Clock className="mr-2" size={16} />
        Status
      </span>
    ),
  }),
  columnHelper.accessor('userId', {
    cell: (info) => info.getValue(),
    header: () => (
      <span className="flex items-center">
        <UserCheck className="mr-2" size={16} />
        UserId
      </span>
    ),
  })
]

// Retrieve data from localStorage
const storedData = JSON.parse(localStorage.getItem('tickets') || 'null')
const data: Reimbursement[] = storedData || []

function PendingTickets() {
  const [selectedTicket, setSelectedTicket] = useState<Reimbursement | null>(null)
  const [tableData] = useState(data)
  const rowClickHandler = (row: Reimbursement) => {
    setSelectedTicket(row)
  }
  const acceptTicket = async () => {
    const myToken = sessionStorage.getItem('authToken') as string
    if (!selectedTicket) return;
  console.log(selectedTicket.reimbId)
  console.log(myToken)
    try {
      await axios.put(`http://localhost:8080/api/admin/acceptticket/${selectedTicket.reimbId}` ,
        {'status': 'APPROVED'},
        {headers: {
            'Authorization': `Bearer ${myToken}`
          }}
      )
      .then((response) => {console.log(response.data)})
    .catch (error => {  console.log(error)})
     // setTableData((prevData) => {prevData[selectedTicket.reimbId].status = 'APPROVED'
      //   return prevData})

      
    } catch (error) {
      console.error('Error updating table:', error)
    }
  }

  const table = useReactTable({
    data: tableData,
    columns,
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <>
      <div className="flex flex-col min-h-screen max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="overflow-x-auto bg-white divide-y divide-gray-200">
          <table className="min-w-full divide-y divide-gray-200 bg-stone-300 text-black font-bold ">
            <thead className=" bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-100 ${selectedTicket?.reimbId === row.original.reimbId ? 'bg-gray-200' : ''}`}
                  onClick={() => rowClickHandler(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-lg text-gray-500 "
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-black">
          <div className="flex items-center mb-4 sm:mb-0 ">
            <span className="mr-2">Items per page</span>
            <select
              className="border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value))
              }}
            >
              {[5, 10, 20, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="p-2 rounded-md bg-gray-200 text-black hover:bg-gray-300 disabled:opacity-50"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft size={20} />
            </button>
            <button
              className="p-2 rounded-md bg-gray-200 text-black hover:bg-gray-300 disabled:opacity-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft size={20} />
            </button>
            <span className="flex items-center">
              <input
                min={1}
                max={table.getPageCount()}
                type="number"
                value={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0
                  table.setPageIndex(page)
                }}
                className="w-16 p-2 rounded-md border border-gray-300 text-center"
              />
              <span className="ml-1">of {table.getPageCount()}</span>
            </span>
            <button
              className="p-2 rounded-md bg-gray-200 text-black hover:bg-gray-300 disabled:opacity-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight size={20} />
            </button>
            <button
              className="p-2 rounded-md bg-gray-200 text-black hover:bg-gray-300 disabled:opacity-50"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight size={20} />
            </button>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={acceptTicket}
            disabled={!selectedTicket}
            className="px-4 py-2 bg-blue-500 border-opacity-80 rounded-full text-white hover:bg-blue-800"
          >
            Approve ticket
          </button>
        </div>
      </div>
    </>
  )
}
/*interface Reimbursement {
  reimbId: number,
  description: string,
  amount: number,
  status: string,
  userId: number
}*/
