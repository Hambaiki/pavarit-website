import MainContainer from "@/components/container/MainContainer";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import PostEditor from "@/components/post/editor/PostEditor";

function CreatePage() {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Create", href: "/blog/create" },
  ];

  return (
    <MainContainer>
      <header className="flex flex-col">
        <Breadcrumbs breadcrumbs={breadcrumbs} />

        <div className="space-y-4 mt-8">
          <h1 className="text-4xl font-bold">Create Post</h1>
          <p className="text-neutral-300">Create a new post.</p>
        </div>
      </header>

      <div className="mt-8">
        <PostEditor />
      </div>
    </MainContainer>
  );
}

export default CreatePage;
