import React from 'react'
import { DatabaseProvider } from '@nozbe/watermelondb/DatabaseProvider'
import { database } from './index'

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <DatabaseProvider database={database}>
      {children}
    </DatabaseProvider>
  )
}
