import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";

export default function BasicTables() {
  return (
    <>
      <PageMeta
        title="AUFT"
        description="A-Ligue Football Tournament Management System"
      />
      <PageBreadcrumb pageTitle="Match table" />
      <div className="space-y-6">
        <ComponentCard title="" >
          <BasicTableOne />
        </ComponentCard>
      </div>
      
    </>
  );
}
