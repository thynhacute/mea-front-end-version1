'use client';

import { PropsWithChildren, useEffect, useState } from 'react';

import { ConfigProvider, theme } from 'antd';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { useTheme } from 'next-themes';
import { ToastContainer } from 'react-toastify';

import { defaultLocale, languages } from '@/locale';

import { AntdProvider } from './AntdProvider';

export type ProviderProps = PropsWithChildren<{}>;

export function AntdConfigProvider({ children }: ProviderProps) {
  const { theme: nowTheme } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm:
          // nowTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
          theme.defaultAlgorithm,
        token: {
          borderRadius: 4,
          colorPrimary: '#31a24c',
          colorInfo: '#31a24c',
        },
      }}
    >
      <AntdProvider>{children}</AntdProvider>
      <ToastContainer autoClose={2000} position="top-left" />
    </ConfigProvider>
  );
}

export default function ThemeProvider(props: ProviderProps) {
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // use your loading page
    return <div className="hidden">{props.children}</div>;
  }

  return (
    <NextThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AntdConfigProvider {...props} />
    </NextThemeProvider>
  );
}
