import Link from 'next/link';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-3 ${className}`}>
      {/* Monogram SL */}
      <div className="flex items-center justify-center text-primary font-heading italic text-2xl tracking-tighter">
        <span className="mr-[-6px]">S</span>
        <span>L</span>
      </div>
      {/* Brand Text */}
      <span className="font-heading text-foreground uppercase tracking-[0.2em] text-sm">
        SagaLeor
      </span>
    </Link>
  );
}
