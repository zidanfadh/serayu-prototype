'use client'

import { Suspense } from 'react'
import { WorkOrderPlanForm } from './form'

export default function CreateWorkOrderPlanPage() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <WorkOrderPlanForm />
    </Suspense>
  )
}
