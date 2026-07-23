import mongoose, {Schema} from "mongoose";

const playlistSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
})

playlistSchema.index({ name: 1, userId: 1}, {unique: true})

export const Playlist = mongoose.model("Playlist", playlistSchema);