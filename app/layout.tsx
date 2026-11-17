import type {Metadata} from 'next';
export const metadata:Metadata={title:'Matchday — School Cricket',description:'School cricket match centre and private scoring workspace.'};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><head><link rel="stylesheet" href="/style.css"/></head><body>{children}</body></html>}
