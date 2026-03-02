import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    senderId: mongoose.Types.ObjectId;
    senderRole: string; // 'coaching', 'school', 'consultant'
    senderName: string; // The brand or person sending it
    receiverEmail: string;
    subject: string;
    content: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        senderRole: {
            type: String,
            required: true,
            enum: ['coaching', 'school', 'consultant', 'admin', 'hr'] // Added admin/hr just in case
        },
        senderName: {
            type: String,
            required: true,
        },
        receiverEmail: {
            type: String,
            required: true,
            index: true,
        },
        subject: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// We check if the model exists to prevent recompilation errors in Next.js hot-reloading
export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
