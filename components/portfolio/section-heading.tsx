interface SectionHeadingProps {
  number: string;
  title: string;
}

export function SectionHeading({ number, title }: SectionHeadingProps) {
  return (
    <div className="mb-10 flex items-baseline gap-4">
      <span className="font-mono text-sm text-primary/70">{number}</span>
      <h2 className="font-serif text-3xl font-medium">{title}</h2>
    </div>
  );
}
