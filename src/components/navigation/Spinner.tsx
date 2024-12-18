function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={`border-8 border-neutral-700 border-t-suzuha-teal-500 rounded-full w-16 h-16 animate-spin ${className}`}
    />
  );
}

export default Spinner;
