"use client";


import React, { useState } from 'react';
import { FiPlus, FiSearch, FiTrash2, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { signOut, useSession } from "next-auth/react";
export default function EmployeeDashboard() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 2;

 
 
  const employees = [
    { id: 1, firstName: 'Joshua', lastName: 'Bakare', email: 'josh.bakery@gmail.com', phone: '+2348012345678', role: 'Admin' },
    { id: 2, firstName: 'Jane', lastName: 'Clement', email: 'josh.bakery@gmail.com', phone: '+2348012345678', role: 'Staff' },
    { id: 3, firstName: 'Hannah', lastName: 'Johnson', email: 'josh.bakery@gmail.com', phone: '+2348012345678', role: 'Staff' },
    { id: 4, firstName: 'John', lastName: 'Ngoka', email: 'josh.bakery@gmail.com', phone: '+2348012345678', role: 'Staff' },
    { id: 5, firstName: 'Omotayo', lastName: 'Adeleke', email: 'josh.bakery@gmail.com', phone: '+2348012345678', role: 'Staff' },
    { id: 6, firstName: 'Gloria', lastName: 'Amadi', email: 'josh.bakery@gmail.com', phone: '+2348012345678', role: 'Staff' },
  ];

  const toggleSelectRow = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
      


        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold text-gray-800">Employees</h2>
            <button className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center">
              <FiPlus className="mr-2" />
              Add New
            </button>
          </div>

   
          <div className="bg-white rounded-md shadow-sm p-6 mb-6">
            <div className="flex justify-between">
              <h3 className="text-xl font-semibold text-gray-800">Josh Bakery Ventures</h3>
              <span className="text-gray-600">62, Bode Thomas, Surulere, Lagos</span>
            </div>
          </div>

    
          <div className="flex justify-between mb-4">
            <div className="flex items-center">
              <div className="relative mr-4">
                <select className="appearance-none border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm bg-white">
                  <option>Change role</option>
                  <option>Admin</option>
                  <option>Staff</option>
                </select>
                <FiChevronLeft className="absolute right-2 top-1/2 transform -translate-y-1/2 rotate-90" />
              </div>
              <button className="bg-green-500 text-white px-4 py-2 rounded-md text-sm">Change</button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter staff name here..."
                className="pl-3 pr-10 py-2 border border-gray-300 rounded-md w-64 text-sm"
                value={searchTerm}
                onChange={handleSearch}
              />
              <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Employees Table */}
          <div className="bg-white rounded-md shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-green-500 focus:ring-green-400 border-gray-300 rounded"
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    First Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Last Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee.id} className={employee.firstName === 'Jane' ? 'bg-green-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input 
                        type="checkbox"
                        className="h-4 w-4 text-green-500 focus:ring-green-400 border-gray-300 rounded"
                        checked={selectedRows.includes(employee.id)}
                        onChange={() => toggleSelectRow(employee.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {employee.firstName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {employee.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {employee.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {employee.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {employee.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-gray-500 hover:text-gray-700">
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-end items-center mt-4">
            <span className="text-sm text-gray-700 mr-4">
              {currentPage} of {totalPages}
            </span>
            <div className="flex space-x-1">
              <button 
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`p-1 rounded-full ${currentPage === 1 ? 'text-gray-300' : 'text-green-500 bg-green-100'}`}
              >
                <FiChevronLeft size={18} />
              </button>
              <button 
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`p-1 rounded-full ${currentPage === totalPages ? 'text-gray-300' : 'text-green-500 bg-green-100'}`}
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}