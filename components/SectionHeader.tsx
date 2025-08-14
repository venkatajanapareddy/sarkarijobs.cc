interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{title}</h2>
      {subtitle && (
        <p className="text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
      )}
    </div>
  );
}