'use client';

import React from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { StateContext } from '@/context/StateContext';
import { UserContext } from '@/context/UserContext';
import { Toaster } from 'sonner';
import '@/app/globals.css'; // Make sure this import is there for Tailwind + global styles

const Layout = ({ children, pageTitle = "Book My Trip", pageDescription = "Your trusted travel partner" }) => {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Add favicon or meta image for SEO if you want */}
      </Head>

      <UserContext>
        <StateContext>
          <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 antialiased">
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4 py-6">
              {children}
            </main>

            {/* Footer */}
            <Footer />

            {/* Toast Notifications */}
            <Toaster richColors position="top-center" />
          </div>
        </StateContext>
      </UserContext>
    </>
  );
};

export default Layout;
