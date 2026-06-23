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
    <main className={`${className ?? ""} w-full`}>
      {loading ? <Loading /> : children}
    </main>
  );
}

export default MainContainer;
