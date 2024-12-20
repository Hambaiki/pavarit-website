import Loading from "../navigation/Loading";

function MainContainer({
  children,
  className,
  loading,
}: {
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
}) {
  return (
    <main className={`${className ?? ""} w-full max-w-6xl mx-auto p-4 md:p-8`}>
      {loading ? <Loading /> : children}
    </main>
  );
}

export default MainContainer;
