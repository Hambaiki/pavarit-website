function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={`border-8 border-surface-muted border-t-accent rounded-full w-16 h-16 animate-spin ${className}`}
    />
  );
}

export default Spinner;
