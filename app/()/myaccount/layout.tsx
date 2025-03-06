"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiGrid, FiUsers, FiFileText, FiChevronLeft } from 'react-icons/fi';
import { signOut, useSession } from "next-auth/react";

const DashLayout = ({ children }: { children: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState('users');
  const { status, data } = useSession();
  const router = useRouter();
  
  const showSession = () => {
    if (status === "authenticated") {
      return (
        <button
          className="border border-solid border-black p-2 text-green-500 rounded"
          onClick={() => {
            signOut({ redirect: false }).then(() => {
              router.push("/login");
            });
          }}
        >
          Sign Out
        </button>
      )
    } else if (status === "loading") {
      return (
        <span className="text-[#888] text-sm mt-7">Loading...</span>
      )
    } else {
      return (
        <Link
          href="/login"
          className="border border-solid border-black rounded p-2"
        >
          Sign In
        </Link>
      )
    }
  }

  useEffect(() => {
    if (activeTab === 'dashboard') {
      router.push("/");
    } else if (activeTab === 'users') {
      router.push("/myaccount/users");
    } else {
      router.push("/myaccount/docs");
    }
  }, [activeTab, router])
  
  return (
    <div className="flex flex-col h-screen">
      {/* Fixed Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-lg font-medium text-gray-800">Getchange</h1>
        <div className="flex items-center">
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white">
              <span className='uppercase'>{data?.user?.name?.[0]}{data?.user?.name?.[1]}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium">{data?.user?.name}</span>
              <FiChevronLeft className="transform rotate-180" />
            </div>
            {showSession()}
          </div>
        </div>
      </header>
      
      {/* Main Content and Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Fixed Sidebar */}
        <div className="w-16 border-r border-gray-200 flex-shrink-0 bg-white h-full">
          <div className="flex flex-col items-center space-y-20 mt-10 cursor-pointer w-full">
            <div className="relative w-full flex justify-center">
              {activeTab === 'dashboard' && (
                <div className="absolute left-0 top-0 w-1 h-8 bg-green-500 rounded-r-full"></div>
              )}
              <button 
                className={`w-8 h-8 rounded-md flex items-center justify-center ${
                  activeTab === 'dashboard' ? 'text-green-500' : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('dashboard')}
              >
                <FiGrid size={30} />
              </button>
            </div>
            
            <div className="relative w-full flex justify-center">
              {activeTab === 'users' && (
                <div className="absolute left-0 top-0 w-1 h-8 bg-green-500 rounded-r-full"></div>
              )}
              <button 
                className={`w-8 h-8 rounded-md flex items-center justify-center ${
                  activeTab === 'users' ? 'text-green-500' : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('users')}
              >
                <FiUsers size={30} />
              </button>
            </div>
          
            <div className="relative w-full flex justify-center">
              {activeTab === 'documents' && (
                <div className="absolute left-0 top-0 w-1 h-8 bg-green-500 rounded-r-full"></div>
              )}
              <button 
                className={`w-8 h-8 rounded-md flex items-center justify-center ${
                  activeTab === 'documents' ? 'text-green-500' : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('documents')}
              >
                <FiFileText size={30} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashLayout;