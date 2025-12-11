import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import { schema } from './schema'
import { User, Conversation, Message } from './models'

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  schema,
  // (You might want to comment out this line if you want to keep the database between sessions)
  // dbName: 'assistry_chat',
  // (optional database name or file system path)
  // schemaVersion: 1,
  // migrationEvents: {
  //   onSuccess: () => {
  //     // user notified of migration success
  //   },
  //   onError: (error) => {
  //     // user notified of migration error
  //   },
  // },
})

// Then, make a Watermelon database from it!
export const database = new Database({
  adapter,
  modelClasses: [
    User,
    Conversation,
    Message,
  ],
})
