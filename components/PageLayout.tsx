// This component is deprecated since Header is now in the root layout
// Kept for backward compatibility with existing pages
interface PageLayoutProps {
  children: React.ReactNode
}

export default function PageLayout({ children }: PageLayoutProps) {
  // Header is now included in the root layout.tsx
  // This component just passes through children
  return <>{children}</>;
}