'use client'

import { Suspense } from 'react'
import HomePage from './HomePage'
import { Job } from '@/lib/jobs-types'

interface HomePageWrapperProps {
  jobs: Job[]
  savedJobIds?: string[]
}

export default function HomePageWrapper({ jobs, savedJobIds = [] }: HomePageWrapperProps) {
  return (
    <Suspense fallback={null}>
      <HomePage jobs={jobs} savedJobIds={savedJobIds} />
    </Suspense>
  )
}