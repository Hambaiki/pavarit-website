import Loading from "@/components/navigation/Loading";

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
    <main className={`${className ?? ""} w-full mx-auto p-4 md:p-8`}>
      {loading ? <Loading /> : children}
    </main>
  );
}

export default MainContainer;
