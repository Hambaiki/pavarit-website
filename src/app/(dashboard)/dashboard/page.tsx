import Header from "@/components/content/Header";
import Section from "@/components/content/Section";
import OptionMenuGrid from "@/components/ui/OptionMenuGrid";
import { menuItems } from "@/constants/dashboard";

export default function Dashboard() {
  return (
    <>
      <Header
        title="Administrator Menu"
        description="Manage website content and settings"
      />

      <Section>
        <OptionMenuGrid items={menuItems} />
      </Section>
    </>
  );
}
