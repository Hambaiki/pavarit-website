import Button from "../Button";

function MorePostBanner() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-gray-850 rounded-xl">
      <p className="text-center md:text-left">
        Interested in my other posts?
        <strong> Check out other posts here!</strong>
      </p>
      <Button
        href="/blog/all"
        variant="primary"
        className="px-4 py-2 rounded-full"
      >
        View More Posts
      </Button>
    </div>
  );
}

export default MorePostBanner;
