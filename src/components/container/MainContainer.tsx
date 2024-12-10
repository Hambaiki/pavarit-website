function MainContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main
      className={`w-full max-w-5xl mx-auto p-4 md:p-8 ${
        className ?? ""
      }`}
    >
      {children}
    </main>
  );
}

export default MainContainer;
