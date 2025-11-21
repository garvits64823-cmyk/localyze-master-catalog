import './globals.css'

export const metadata = {
  title: 'Catalog Admin',
  description: 'Admin panel for catalog management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}