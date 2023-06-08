/* eslint-disable @next/next/no-sync-scripts */
import React from 'react';
import '../app/globals.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-toastify/dist/ReactToastify.css';

import ToastProvider from '../components/wrappers/ToastProvider';
import QueryProvider from '../components/wrappers/QueryProvider';
import AuthWrapper from '../components/wrappers/AuthWrapper';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ToastProvider />
        <QueryProvider>
          <AuthWrapper>{children}</AuthWrapper>
        </QueryProvider>
        <script src='https://unpkg.com/flowbite@1.5.5/dist/flowbite.js'></script>
      </body>
    </html>
  );
}
