import Spinner from "./Spinner";

function Loading() {
  return (
    <div className="flex flex-col flex-auto h-full min-h-140 items-center justify-center">
      <div className="flex flex-col flex-auto items-center justify-center">
        <Spinner />
      </div>
    </div>
  );
}

export default Loading;
