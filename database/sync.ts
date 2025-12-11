import { synchronize } from '@nozbe/watermelondb/sync'
import { database } from './index'
import api from '@/lib/api'

export async function sync() {
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt, schemaVersion, migration }: { lastPulledAt?: number | null, schemaVersion: number, migration: any }) => {
      const response = await api.get('sync', {
        last_pulled_at: lastPulledAt,
        schema_version: schemaVersion,
        migration,
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const { changes, timestamp } = await response.json()
      return { changes, timestamp }
    },
    pushChanges: async ({ changes, lastPulledAt }: { changes: any, lastPulledAt: number }) => {
      const response = await api.post('sync', {
        changes,
        last_pulled_at: lastPulledAt,
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }
    },
    migrationsEnabledAtVersion: 1,
  })
}
