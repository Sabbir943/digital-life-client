import Link from 'next/link';
import React from 'react';

const NotFoundPage = () => {
    
   

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full text-center space-y-6">
                {/* SVG Illustration */}
                <div className="flex justify-center">
                    <svg className="w-64 h-64 text-indigo-600" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="100" cy="100" r="80" fill="#EEF2FF" />
                        <path d="M100 60V110M100 135H100.01" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>

                {/* Text Content */}
                <div className="space-y-2">
                    <h1 className="text-6xl font-extrabold text-gray-900 tracking-tight">404</h1>
                    <h2 className="text-2xl font-bold text-gray-800">Page Under Construction</h2>
                    <p className="text-gray-500 max-w-sm mx-auto">
                        We're building something amazing here! The page you are looking for doesn't exist yet or is currently under development.
                    </p>
                </div>

                {/* Interactive Button */}
                <div>
                    <Link href={'/'}>
                    <button 
                        
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                    >
                        Go Back
                    </button>
                    </Link>
                    
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;