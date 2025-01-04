import { BreadcrumbItem } from "@/types/common";

import Breadcrumbs from "@/components/navigation/Breadcrumbs";

interface MainHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
}

function MainHeader({ title, description, breadcrumbs }: MainHeaderProps) {
  return (
    <header>
      {breadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} />}

      <div className="flex flex-col space-y-4 mt-8">
        <h1>{title}</h1>
        {description && <p className="mt-4">{description}</p>}
      </div>
    </header>
  );
}

export default MainHeader;
