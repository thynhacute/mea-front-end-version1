'use client';

import { useEffect } from 'react';

import { headers } from 'next/headers';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { NKRouter } from '@/core/NKRouter';

interface NotFoundProps {}

const NotFound: React.FC<NotFoundProps> = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-[url('https://images.unsplash.com/photo-1601119479271-21ca92049c81?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')]">
      <div className="flex flex-col items-center gap-4 px-6 py-8 rounded-lg bg-white/60">
        <div className="text-4xl font-semibold ">Page not found</div>
        <Link href={NKRouter.dashboard()} className="font-semibold text-blue-600">
          Go Back
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
