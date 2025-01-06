'use client';

import { GraduationCap, Users } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Parent-Teacher Interaction Portal
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Facilitating seamless communication between parents and teachers for better academic growth
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* Parent Card */}
          <Link href="/login?role=parent">
            <div className="group hover:scale-105 transition-transform duration-300 bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-purple-100 cursor-pointer">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Parent Portal</h2>
              <p className="text-gray-600">
                Schedule meetings with teachers, submit queries, and track your child's academic progress
              </p>
              <div className="mt-6 inline-flex items-center text-purple-600 group-hover:text-purple-700">
                Login as Parent
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Teacher Card */}
          <Link href="/login?role=teacher">
            <div className="group hover:scale-105 transition-transform duration-300 bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-indigo-100 cursor-pointer">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl mb-6">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Teacher Portal</h2>
              <p className="text-gray-600">
                Manage meeting requests, view student details, and communicate with parents effectively
              </p>
              <div className="mt-6 inline-flex items-center text-indigo-600 group-hover:text-indigo-700">
                Login as Teacher
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}