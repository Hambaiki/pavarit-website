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
    <div className={`${className ?? ""} w-full mx-auto p-4 md:py-8 md:px-8`}>
      {loading ? <Loading /> : children}
    </div>
  );
}

export default MainContainer;
