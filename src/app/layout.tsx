import './globals.css';
import React from 'react';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'PEC Chandigarh Venue Booking & Digital Permissions (Docify)',
  description: 'Official Room & Venue Permission software with 5-tier digital signature approval workflow for Punjab Engineering College clubs & societies.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
          {children}
        </main>
        <footer className="no-print bg-[#002244] text-slate-300 text-xs py-6 border-t border-blue-900 mt-12">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div>
              <p className="font-bold text-white">Punjab Engineering College (Deemed to be University), Chandigarh</p>
              <p className="text-slate-400">Developed for Office of Dean Student Affairs • Powered by Docify & Venue Inventory Engine</p>
            </div>
            <div className="flex items-center space-x-4 text-slate-400">
              <span>IEEE Student Branch</span>
              <span>•</span>
              <span>PEC Robotics Society</span>
              <span>•</span>
              <span>Student Council</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
