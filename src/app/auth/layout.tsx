import * as React from 'react';

import UnAuthWrapper from '@/core/components/wrapper/UnAuthWrapper';

interface LayoutProps {}

const Layout: React.FunctionComponent<LayoutProps & React.PropsWithChildren> = ({ children }) => {
  return (
    <UnAuthWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen bg-cover gap-10 bg-[url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=3428&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]">
        {children}
        <p className="text-sm text-center text-gray-600">Copyright © MEA 2023.</p>
      </div>
    </UnAuthWrapper>
  );
};
export default Layout;
