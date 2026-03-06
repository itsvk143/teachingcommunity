import mongoose, { Document, Schema, Model } from "mongoose";

export interface IReply {
    content: string;
    authorId: string;
    authorName?: string;
    authorRole?: string;
    authorEmail: string;
    upvotes: string[];
    downvotes: string[];
    createdAt: Date;
}

export interface IDiscussion extends Document {
    title: string;
    content: string;
    category: string;
    authorId: string;
    authorEmail: string;
    authorName?: string;
    authorRole?: string;
    replies: IReply[];
    upvotes: string[];
    downvotes: string[];
    createdAt: Date;
    updatedAt: Date;
}

const ReplySchema: Schema<IReply> = new Schema(
    {
        content: { type: String, required: true },
        authorId: { type: String, required: true },
        authorEmail: { type: String, required: true },
        authorName: { type: String, default: "Anonymous" },
        authorRole: { type: String, default: "user" },
        upvotes: { type: [String], default: [] },
        downvotes: { type: [String], default: [] },
    },
    { timestamps: true }
);

const DiscussionSchema: Schema<IDiscussion> = new Schema(
    {
        title: { type: String, required: true, trim: true },
        content: { type: String, required: true },
        category: {
            type: String,
            required: true,
            enum: ["General", "Teacher", "Non-Teacher", "Coaching", "School", "Home Tuition", "Other"],
            default: "General",
        },
        authorId: { type: String, required: true },
        authorEmail: { type: String, required: true },
        authorName: { type: String, default: "Anonymous" },
        authorRole: { type: String, default: "user" },
        upvotes: { type: [String], default: [] },
        downvotes: { type: [String], default: [] },
        replies: { type: [ReplySchema], default: [] },
    },
    { timestamps: true }
);

const Discussion: Model<IDiscussion> = mongoose.models.Discussion || mongoose.model<IDiscussion>("Discussion", DiscussionSchema);

export default Discussion;
