import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'users',
      columns: [
        { name: 'username', type: 'string' },
        { name: 'avatar', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'conversations',
      columns: [
        { name: 'name', type: 'string', isOptional: true },
        { name: 'avatar', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'last_message_id', type: 'string', isOptional: true },
        { name: 'unread_count', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'messages',
      columns: [
        { name: 'conversation_id', type: 'string', isIndexed: true },
        { name: 'sender_id', type: 'string', isIndexed: true },
        { name: 'content', type: 'string' },
        { name: 'type', type: 'string' },
        { name: 'status', type: 'string' },
        { name: 'attachments', type: 'string', isOptional: true }, // JSON string
        { name: 'reply_to', type: 'string', isOptional: true }, // JSON string or ID
        { name: 'created_at', type: 'number', isIndexed: true },
      ],
    }),
  ],
})
