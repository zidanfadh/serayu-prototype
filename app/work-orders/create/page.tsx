'use client'

import { Suspense } from 'react'
import { WorkOrderCreateForm } from './WorkOrderCreateForm'

export default function CreateWorkOrderPage() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <WorkOrderCreateForm />
    </Suspense>
  )
}
