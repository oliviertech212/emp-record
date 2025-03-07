
"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiSearch, FiTrash2, FiChevronRight, FiChevronLeft, FiEdit, FiX } from 'react-icons/fi';
import { signOut, useSession } from "next-auth/react";
import { FaSpinner } from 'react-icons/fa';

interface Employee {
  _id: string;
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
}

export default function EmployeeDashboard() {
  const { data: session } = useSession();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchRole, setSearchRole] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  
  console.log("data", session);
  

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'Staff',
    employeeId: ''
  });

  useEffect(() => {
    fetchEmployees();
  }, []);
  const filteredEmployees = employees.filter(
    employee => 
      (employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       employee.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedRole === '' || employee.role === selectedRole)
  );

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/employees', {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true 
      });
      setEmployees(response.data.employees);
      setTotalPages(Math.ceil(response.data.employees.length / 10) || 1);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handlecloseError = () => {
    console.log("error close", error);
    setError('');
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
 
  const createEmployee = async () => {
    try {
      const response = await axios.post('/api/employees', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role
      });
      
      setEmployees([...employees, response.data.employee]);
      setShowModal(false);
      resetForm();
    } catch (err: any) {
      console.error('Error creating employee:', err);
      setError(err.response?.data?.message || 'Failed to create employee');
    }
  };

  const updateEmployee = async () => {
    try {
      const response = await axios.put('/api/employees', {
        employeeId: formData.employeeId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone
      });
      
      setEmployees(employees.map(emp => 
        emp._id === formData.employeeId ? response.data.employee : emp
      ));
      setShowModal(false);
      resetForm();
    } catch (err: any) {
      console.error('Error updating employee:', err);
      setError(err.response?.data?.message || 'Failed to update employee');
    }
  };

  const deleteEmployee = async (employeeId: string) => {
    try {
      await axios.delete('/api/employees', {
        data: { employeeId }
      });
      
      setEmployees(employees.filter(emp => emp._id !== employeeId));
    } catch (err: any) {
      console.error('Error deleting employee:', err);
      setError(err.response?.data?.message || 'Failed to delete employee');
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (employee: Employee) => {
    setModalMode('edit');
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
      employeeId: employee._id
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'Staff',
      employeeId: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'create') {
      createEmployee();
    } else {
      updateEmployee();
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterByRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchRole(e.target.value);
  }

  const applyRoleFilter = () => {
    setSelectedRole(searchRole);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchRole('');
    setSelectedRole('');
    setSearchTerm('');
    setCurrentPage(1);
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


  useEffect(() => {
    setTotalPages(Math.ceil(filteredEmployees.length / 10) || 1);
    if (currentPage > Math.ceil(filteredEmployees.length / 10) && filteredEmployees.length > 0) {
      setCurrentPage(1);
    }
  }, [filteredEmployees, currentPage]);

  const indexOfLastEmployee = currentPage * 10;
  const indexOfFirstEmployee = indexOfLastEmployee - 10;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold text-gray-800">Employees</h2>
            <button 
              className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center"
              onClick={openCreateModal}
            >
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

          {error && (
            <div className="bg-red-100 border flex justify-between border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
              <button className='text-red-700' onClick={handlecloseError}>
                <FiX />
              </button>
            </div>
          )}

          <div className="flex justify-between mb-4">
            <div className="flex items-center">
              <div className="relative mr-4">
                <select 
                  className="appearance-none border text-black border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm bg-white"
                  onChange={handleFilterByRole}
                  value={searchRole}
                >
                  <option value="">All Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="Staff">Staff</option>
                </select>
                <FiChevronLeft className="absolute right-2 top-1/2 transform -translate-y-1/2 rotate-90" />
              </div>
              <div className="flex space-x-2">
                <button 
                  className="bg-green-500 text-white px-4 py-2 rounded-md text-sm"
                  onClick={applyRoleFilter}
                >
                  Change
                </button>
                {(selectedRole !== '' || searchTerm !== '') && (
                  <button 
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm"
                    onClick={resetFilters}
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter staff name here..."
                className="pl-3 pr-10 py-2 text-black border border-gray-300 rounded-md w-64 text-sm"
                value={searchTerm}
                onChange={handleSearch}
              />
              <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
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

          <div className="bg-white rounded-md shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-6 text-center text-green-500 w-fit m-auto"><FaSpinner className="animate-spin mr-2  " />Loading employees...</div>
            ) : (
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center">
                        No employees found
                      </td>
                    </tr>
                  ) : (
                    currentEmployees.map((employee) => (
                      <tr key={employee._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input 
                            type="checkbox"
                            className="h-4 w-4 text-green-500 focus:ring-green-400 border-gray-300 rounded"
                            checked={selectedRows.includes(employee._id)}
                            onChange={() => toggleSelectRow(employee._id)}
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                          <button 
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => openEditModal(employee)}
                          >
                            <FiEdit size={18} />
                          </button>
                          <button 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => deleteEmployee(employee._id)}
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

       
          
        </div>
      </div>

   
      {showModal && (
        <div className="fixed inset-0  flex items-center justify-center z-50">
          <div className="bg-white shadow-2xl border text-black rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {modalMode === 'create' ? 'Add New Employee' : 'Edit Employee'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 text-black rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 text-black rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 text-black rounded-md"
                    required
                    disabled={modalMode === 'edit'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 text-black rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300  text-black rounded-md"
                    disabled={modalMode === 'edit'}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-green-500 rounded-md"
                >
                  {modalMode === 'create' ? 'Create' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}