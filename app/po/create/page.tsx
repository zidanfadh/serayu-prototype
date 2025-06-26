'use client'
// biar bisa deploy

import { Suspense } from 'react'
import { CreatePOForm } from './po-form'

export default function CreatePOPage() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <CreatePOForm />
    </Suspense>
  )
}