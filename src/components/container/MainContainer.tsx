function MainContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={`${className ?? ""} w-full max-w-5xl mx-auto p-5 md:p-8`}>
      {children}
    </main>
  );
}

export default MainContainer;
