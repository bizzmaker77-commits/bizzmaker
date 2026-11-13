'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployeeLoginRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
