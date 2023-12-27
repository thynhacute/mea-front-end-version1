'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';

import { NKRouter } from '@/core/NKRouter';

export default function Page() {
  const router = useRouter();
  React.useEffect(() => {
    router.push(NKRouter.auth.login());
  }, []);
  return <></>;
}
