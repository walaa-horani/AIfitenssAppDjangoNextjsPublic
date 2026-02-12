import React from 'react'
import Navbar from '../(components)/Navbar'
import Sidebar from '../(components)/Sidebar'
import { Toaster } from "@/components/ui/sonner"
function Dashboardlayout({ children }: { children: React.ReactNode }) {
  return (

    <div className='min-h-screen bg-background flex flex-col'>
      <Navbar />

      <div className='flex flex-1'>
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        <main className="flex-1 p-6">
          {children}
          <Toaster />
        </main>
      </div>
    </div>
  )
}

export default Dashboardlayout