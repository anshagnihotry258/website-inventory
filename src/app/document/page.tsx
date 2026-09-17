'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getPermissions } from '@/lib/db';
import { PermissionRequest } from '@/lib/types';
import OfficialPerforma from '@/components/OfficialPerforma';

function DocumentContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [permission, setPermission] = useState<PermissionRequest | null>(null);

  useEffect(() => {
    if (id) {
      const all = getPermissions();
      const found = all.find(p => p.id === id);
      if (found) {
        setPermission(found);
      }
    }
  }, [id]);

  if (!permission) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-slate-500 font-semibold">Permission document not found.</p>
        <Link href="/approvals" className="text-xs font-bold text-blue-900 underline">
          Return to Approvals Dashboard
        </Link>
      </div>
    );
  }

  return <OfficialPerforma permission={permission} />;
}

export default function DocumentPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading document...</div>}>
      <DocumentContent />
    </Suspense>
  );
}
