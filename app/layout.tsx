import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/navbar';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/lib/auth/context';

// Configure Inter font with optimized loading strategy
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
  adjustFontFallback: false,
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'], // Only load needed weights
  preloadFiles: [], // Disable preloading of unused files
  download: true, // Enable font file downloading
  declarations: [
    { prop: 'font-display', value: 'swap' }
  ],
});

export const metadata: Metadata = {
  title: 'RecipeVerse - Discover & Share Recipes',
  description: 'A modern platform for discovering and sharing your favorite recipes',
  metadataBase: new URL('https://recipeverse.vercel.app'),
  openGraph: {
    type: 'website',
    title: 'RecipeVerse - Discover & Share Recipes',
    description: 'A modern platform for discovering and sharing your favorite recipes',
    siteName: 'RecipeVerse',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RecipeVerse - Discover & Share Recipes',
    description: 'A modern platform for discovering and sharing your favorite recipes',
  },
  other: {
    'google-font-display': 'swap',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' }
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning 
      className={`${inter.variable} antialiased`}
    >
      <body 
        className="min-h-screen bg-background font-sans" 
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Toaster />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}