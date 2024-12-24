import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Development Page",
    description: "This is the development page.",
  };
}

export default async function DevelopPage() {
  //   const response = await fetch(
  //     `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/linkscope`,
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         input: {},
  //       }),
  //       cache: "no-store",
  //     }
  //   );

  //   const result = await response.json();

  //   console.log(result);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900">
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h1 className="mb-8">Development Page</h1>
      </div>
    </div>
  );
}
