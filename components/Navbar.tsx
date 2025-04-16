'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils'; 

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-md px-4 py-3 flex justify-center space-x-4 text-center">
      <Link
        href="/"
        className={cn(
          'font-medium',
          pathname === '/' ? 'text-blue-600' : 'text-gray-700'
        )}
      >
        Dashboard
      </Link>
      <Link
        href="/transactions"
        className={cn(
          'font-medium',
          pathname === '/transactions' ? 'text-blue-600' : 'text-gray-700'
        )}
      >
        All Transactions
      </Link>
      <Link
        href="/breakdown"
        className={cn(
          'font-medium',
          pathname === '/breakdown' ? 'text-blue-600' : 'text-gray-700'
        )}
      >
        Category Breakdown
      </Link>
    </nav>
  );
}
