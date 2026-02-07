import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import DefaultInputs from "../../components/form/form-elements/DefaultInputs";
import PageMeta from "../../components/common/PageMeta";
import RecentOrders from "../../components/ecommerce/RecentOrders";
// import EditPost from "../../components/form/form-elements/EditPost";

export default function FormElements() {
  return (
    <div>
      <PageMeta
        title="Admin-Management blogs"
        description="This is iATER dashboard management about blogs and users"
      />
      <PageBreadcrumb pageTitle="From" />
          <DefaultInputs />
      <div className="grid  gap-6 xl:grid-cols-2">
        <div className="space-y-12">
        </div>
        {/* <div className="space-y-6">
          <EditPost />
        </div> */}
      </div>
        <div className="space-y-6 mt-8">
          <RecentOrders />
        </div>
    </div>
  );
}
