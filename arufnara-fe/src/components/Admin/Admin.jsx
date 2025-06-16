"use client"
// components/admin/Admin.jsx
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const Admin = ({ children }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    // Jika tidak login atau bukan admin, arahkan ke /login atau /user
    if (!token || !user || user.role !== "admin") {
      router.push(user?.role === "user" ? "/user" : "/auth/login");
    }
  }, []);

  return (
    <div>

       {/* Header */}

      <header className="sticky top-0 z-50 flex items-center justify-start w-full p-4 text-white duration-300 bg-gray-800 md:justify-center">
        <div className="flex items-center">
          <img className="mr-2 overflow-hidden rounded-md w-7 h-7 md:w-10 md:h-10" src="/logo.png"/>
          <span className="text-lg font-semibold"> Admin Control </span>
        </div>
        
        <div className='flex items-center justify-center flex-1 mx-4'>
          <div className='flex items-center w-full max-w-xl p-2 mr-4 bg-white border border-gray-200 rounded shadow-sm'>
            <button className='outline-none focus:outline-none'>
              <svg className='w-5 h-5 text-gray-600 cursor-pointer' fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>
            <input type="search" name="" id="" placeholder="Search" className='w-full pl-3 text-sm text-black bg-transparent outline-none focus:outline-none'/>
          </div>
        </div>
        <ul className="flex items-center">
          <li>
            <div className='block w-px h-6'></div>
          </li>
          <li>
            <button onClick={handleLogout} className='flex items-center mr-4 hover:text-blue-100'>
              <span className='inline-flex mr-1'>
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'/>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </span>
              Logout
            </button>
          </li>
        </ul>
      </header>

      {/* sidebar */}

      <div className="flex">
        <aside className="w-64 min-h-screen p-4 bg-gray-200">
          <div className='fixed left-0 flex flex-col top-14 w-14 hover:w-64 md:w-64'> 
            <div className='flex flex-col justify-between flex-grow overflow-x-hidden overflow-y-auto'>
              <ul className='flex flex-col py-4 space-y-1'>
                <li className='hidden px-5 md:block'>
                  <div className='flex flex-row items-center h-8'>
                    <div className='text-sm font-light tracking-wide text-gray-400 uppercase'>
                      Main
                    </div>
                  </div>
                </li>
                <li>
                  <a href="/admin" className='relative flex flex-row items-center h-11 focus:outline-none'>
                    <span className='inline-flex items-center justify-center ml-4'>
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                      </svg>
                    </span>
                    <span className='ml-2 text-sm tracking-wide truncate'> Dashboard </span>
                  </a>
                </li>
                <li>
                  <a href="/admin/topup" className='relative flex flex-row items-center h-11 focus:outline-none'>
                    <span className='inline-flex items-center justify-center ml-4'>
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                      </svg>
                    </span>
                    <span className='ml-2 text-sm tracking-wide truncate'>TopUp</span>
                  </a>
                </li>
                <li>
                  <a href="/admin/order" className='relative flex flex-row items-center h-11 focus:outline-none'>
                    <span className='inline-flex items-center justify-center ml-4'>
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
                      </svg>
                    </span>
                    <span className='ml-2 text-sm tracking-wide truncate'>Order</span>
                  </a>
                </li>

                <li>
                <a href="/admin/payment" className='relative flex flex-row items-center h-11 focus:outline-none'>
                  <span className='inline-flex items-center justify-center ml-4'>
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c4.418 0 8-1.79 8-4v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2c0 2.21 3.582 4 8 4z" />
                    </svg>
                  </span>
                  <span className='ml-2 text-sm tracking-wide truncate'>Payment</span>
                </a>
              </li>
                
                <li>
                  <a href="/admin/user" className='relative flex flex-row items-center h-11 focus:outline-none'>
                    <span className='inline-flex items-center justify-center ml-4'>
                      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d="M5.121 17.804A10.974 10.974 0 0112 15c2.5 0 4.847.797 6.879 2.15M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                    </span>
                    <span className='ml-2 text-sm tracking-wide truncate'>User</span>
                  </a>
                </li>
              
              </ul>
            </div>
          </div>
        </aside>

        {/* isi content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default Admin;
