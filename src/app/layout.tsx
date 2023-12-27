'use client';

import { ReactNode } from 'react';

import '@/core/NKConfig';
import TanQueryClient from '@/core/components/common/TanQueryClient';
import ThemeProvider from '@/core/components/common/ThemeProvider';
import TryAuthWrapper from '@/core/components/wrapper/TryAuthWrapper';
import { MenuDashboardProvider } from '@/core/contexts/MenuDashboardContext';
import { Providers } from '@/core/store/provider';
import '@/styles/globals.css';

import 'antd/dist/reset.css';
import 'react-photo-view/dist/react-photo-view.css';
import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';
import 'tippy.js/dist/tippy.css';

type Props = {
  children: ReactNode;
};

// Even though this component is just passing its children through, the presence
// of this file fixes an issue in Next.js 13.4 where link clicks that switch
// the locale would otherwise cause a full reload.
export default function RootLayout({ children }: Props) {
  return (
    <html>
      <head>
        <title>MEA Dashboard</title>
        <link rel="icon" href="https://mea-be.s3.ap-southeast-1.amazonaws.com/user/a8e28884-77dd-4c12-8514-c13f38fcdb09-undefined.png" />
      </head>
      <body className="">
        <Providers>
          <TanQueryClient>
            <ThemeProvider>
              <TryAuthWrapper>
                <MenuDashboardProvider>
                  <main>{children}</main>
                </MenuDashboardProvider>
              </TryAuthWrapper>
            </ThemeProvider>
          </TanQueryClient>
        </Providers>
      </body>
    </html>
  );
}
