import { Model } from '@nozbe/watermelondb'
import { field, text, date, children, writer, readonly } from '@nozbe/watermelondb/decorators'

export class User extends Model {
  static table = 'users'

  @text('username') username!: string
  @text('avatar') avatar!: string
  @date('created_at') createdAt!: number
  @date('updated_at') updatedAt!: number
}

export class Conversation extends Model {
  static table = 'conversations'

  @text('name') name!: string
  @text('avatar') avatar!: string
  @date('created_at') createdAt!: number
  @date('updated_at') updatedAt!: number
  @text('last_message_id') lastMessageId!: string
  @field('unread_count') unreadCount!: number

  @children('messages') messages!: any
}

export class Message extends Model {
  static table = 'messages'

  @text('conversation_id') conversationId!: string
  @text('sender_id') senderId!: string
  @text('content') content!: string
  @text('type') type!: string
  @text('status') status!: string
  @text('attachments') attachments!: string // JSON
  @text('reply_to') replyTo!: string // JSON
  @date('created_at') createdAt!: number

  get text() {
    return this.content
  }

  get sender() {
    return this.senderId
  }

  get attachmentsArray() {
    try {
      return JSON.parse(this.attachments)
    } catch (e) {
      return []
    }
  }

  get replyToObject() {
    try {
      return JSON.parse(this.replyTo)
    } catch (e) {
      return null
    }
  }
}
