import { Inter, Sarabun } from 'next/font/google';

export const fontSans = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
    display: 'swap',
});

export const fontThai = Sarabun({
    subsets: ['thai', 'latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-thai',
    display: 'swap',
});
