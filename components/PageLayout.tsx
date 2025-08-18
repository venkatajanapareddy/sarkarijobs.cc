import Header from "./Header"

interface PageLayoutProps {
  children: React.ReactNode
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <>
      <Header />
      <div className="flex-grow">
        {children}
      </div>
    </>
  )
}