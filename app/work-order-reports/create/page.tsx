import { Suspense } from "react";
import { WorkOrderReportPage } from "./form";

export default function CreateWorkOrderReportPage() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <WorkOrderReportPage />
    </Suspense>
  )
}