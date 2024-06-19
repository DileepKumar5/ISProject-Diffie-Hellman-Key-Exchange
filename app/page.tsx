"use client";
import Link from 'next/link';

const Welcome = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Welcome</h1>
      <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md">
        <div className="mb-4">
          <Link href="/diffie-hellman" className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 text-center block">
              Diffie-Hellman Key Exchange
         
          </Link>
        </div>
        <div className="mb-4">
          <Link href="/primitive-root" className="w-full px-4 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 text-center block">
              Calculate Primitive Root
         
          </Link>
        </div>
        <div className="mb-4">
          <Link href="/interactive-exchange" className="w-full px-4 py-2 font-bold text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 text-center block">
              Interactive Key Exchange
           
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
