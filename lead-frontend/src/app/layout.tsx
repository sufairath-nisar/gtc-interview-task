import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Leads Manager',
  description: 'Leads CRUD frontend for GTC Task',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="p-4 bg-gray-100 text-gray-900">{children}</body>
    </html>
  );
}
