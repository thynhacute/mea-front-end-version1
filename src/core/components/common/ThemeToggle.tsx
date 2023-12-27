'use client';

import React from 'react';

import { Dropdown, MenuProps } from 'antd';
// import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import Icons from '../icon/Icons';

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  // const t = useTranslations('theme');

  const onClick: MenuProps['onClick'] = ({ key }) => {
    setTheme(key);
  };

  const items: MenuProps['items'] = [
    {
      key: 'light',
      label: (
        <div className="flex items-center">
          <Icons.SunMedium className="w-5 h-5 mr-2 text-orange-500" />
          {/* <span>{t('light')}</span> */}
        </div>
      ),
    },
    {
      key: 'dark',
      label: (
        <div className="flex items-center">
          <Icons.Moon className="w-5 h-5 mr-2 text-blue-500" />
          {/* <span>{t('dark')}</span> */}
        </div>
      ),
    },
    {
      key: 'system',
      label: (
        <div className="flex items-center">
          <Icons.Laptop className="stroke-1.5 mr-2 h-5 w-5" />
          {/* <span>{t('system')}</span> */}
        </div>
      ),
    },
  ];

  return (
    <Dropdown
      menu={{
        items,
        selectable: true,
        selectedKeys: [theme ?? 'system'],
        onClick,
      }}
    >
      <button className="btn">
        <Icons.SunMedium className="text-orange-500 transition-all scale-100 rotate-0 dark:-rotate-90 dark:scale-0" />
        <Icons.Moon className="absolute text-blue-500 transition-all scale-0 rotate-90 dark:rotate-0 dark:scale-100" />
      </button>
    </Dropdown>
  );
}
