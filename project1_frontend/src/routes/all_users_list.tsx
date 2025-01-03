import { createFileRoute } from '@tanstack/react-router'
import { useReactTable, createColumnHelper, flexRender, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table'
import axios from 'axios'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Key, Lock, Users } from 'react-feather'


export const Route = createFileRoute('/all_users_list')({
  component: AllUsersList,
})
interface User {
    userId: number,
    username: string,
    roleId: number
}
const columnHelper = createColumnHelper<User>()

const columns = [
  columnHelper.accessor('userId', {
    cell: (info) => info.getValue(),
    header: () => (
      <span className="flex items-center">
        <Key className='mr-2' size={16} />ID
      </span>
    )

  }),
  columnHelper.accessor('username', {
    cell: (info) => info.getValue(),
    header: () => (
      <span className="flex items-center">
        <Users className='mr-2' size={16}/> Username
      </span>
    )

  }),
  columnHelper.accessor('roleId', {
    cell: (info) => info.getValue(),
    header: () => (
      <span className="flex items-center">
        <Lock className='mr-2' size={16}/> RoleId
      </span>
    )

  }),
]

// Retrieve data from localStorage
const storedData = JSON.parse(localStorage.getItem('data') || 'null')
const data: User[] = storedData || []

function AllUsersList() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [tableData, setTableData] = useState(data)
  const rowClickHandler = (row: User) => {
    setSelectedUser(row)
  }
  const deleteUser = async () => {
    const myToken = sessionStorage.getItem("authToken") as string
    if (!selectedUser) return;  

    try {
      const response = await axios.delete(`http://localhost:8080/api/admin/deleteuser/${selectedUser.userId}`,
        {headers: {
          'Authorization': `Bearer ${myToken}`
        }}
      )
      
      console.log('Update response:', response)
      setTableData ((prevData) => prevData.filter((user) => user.userId !== selectedUser.userId))
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
    getPaginationRowModel : getPaginationRowModel()
    }
  )

 
return (
  <>
  <div className='flex flex-col min-h-screen max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
  <div className='overflow-x-auto bg-white divide-y divide-gray-200'>
    <table className="min-w-full divide-y divide-gray-200 bg-stone-300 text-black font-bold " >
      <thead className=' bg-gray-50'>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key= {headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th 
                  key={header.id} 
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  <div >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}

      </thead>
      <tbody > 
        {
          table.getRowModel().rows.map(row => (
            <tr key={row.id} className={`hover:bg-gray-100 ${selectedUser?.userId === row.original.userId ? 'bg-gray-200' : ''}`}
             onClick={() => rowClickHandler(row.original)}>
              {
                row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className='px-6 py-4 whitespace-nowrap text-lg text-gray-500 ' >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                )
              )
              }

            </tr>
          ))
        }
      </tbody>
    </table>
  </div>
    <div className='flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-black'>
      <div className='flex items-center mb-4 sm:mb-0 '>
        <span className='mr-2'>Items per page</span>
        <select className='border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2'
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value))
        }}>
          {
            [5, 10, 20, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))
          }

        </select>
        </div>
        <div className='flex items-center space-x-2'>
          <button className='p-2 rounded-md bg-gray-200 text-black hover:bg-gray-300 disabled:opacity-50'
           onClick={() => table.setPageIndex(0)} 
           disabled={!table.getCanPreviousPage()}>  
           <ChevronsLeft size={20} />
          </button>
          <button className='p-2 rounded-md bg-gray-200 text-black hover:bg-gray-300 disabled:opacity-50'
           onClick={() => table.previousPage()} 
           disabled={!table.getCanPreviousPage()}>  
           <ChevronLeft size={20} />
          </button>
          <span className='flex items-center'>
            <input
              min={1}
              max={table.getPageCount()}
              type='number'
              value={table.getState().pagination.pageIndex + 1}
              onChange={(e)=> {
                const page = e.target.value ? Number(e.target.value) -1 : 0
                table.setPageIndex(page)
              }}
              className='w-16 p-2 rounded-md border border-gray-300 text-center'
      
            />
            <span className='ml-1'>of {table.getPageCount()}</span>
          </span>
          <button className='p-2 rounded-md bg-gray-200 text-black hover:bg-gray-300 disabled:opacity-50'
           onClick={() => table.nextPage()} 
           disabled={!table.getCanNextPage()}>  
           <ChevronRight size={20} />
          </button>  
          <button className='p-2 rounded-md bg-gray-200 text-black hover:bg-gray-300 disabled:opacity-50'
           onClick={() => table.setPageIndex(table.getPageCount() - 1)} 
           disabled={!table.getCanNextPage()}>  
           <ChevronsRight size={20} />
          </button>    
        </div>
    </div>
    <div className="mt-4">
          <button
            onClick= {deleteUser}
            disabled={!selectedUser}  
            className="px-4 py-2 bg-blue-500 border-opacity-80 rounded-full text-white hover:bg-blue-800"
          >
            Delete user
          </button>
        </div>
    </div>
  </>
)
}

/*  if(storedData !== null) {
  return storedData.map((user: User) => (
    <div key={user.userId} className="card">
        <p>{user.userId}</p>
      <p>{user.username}</p>
      <p>{user.roleId}</p>
    </div>
  ))    } else {
    return <p>No users found</p>
  }*/

