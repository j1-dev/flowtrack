import { AuthProvider } from '@/components/auth-provider';
import { ThemeProvider } from 'next-themes';
import localFont from 'next/font/local';
import './globals.css';

const helveticaNeue = localFont({
  src: [
    {
      path: '../../public/font/HelveticaNeueMedium.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/font/HelveticaNeueBold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/font/HelveticaNeueMediumItalic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/font/HelveticaNeueBoldItalic.otf',
      weight: '600',
      style: 'italic',
    },
  ],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${helveticaNeue.className}`}>
        <ThemeProvider attribute="class">
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
