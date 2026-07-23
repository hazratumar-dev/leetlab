import mongoose, {Schema} from "mongoose";

const problemPlaylistSchema = new Schema({
    playlistId: {
        type: Schema.Types.ObjectId,
        ref: "Playlist", 
        required: true
    },
    problemId: {
        type: Schema.Types.ObjectId,
        ref: "Problem",
        required: true
    }
}, {
    timestamps: true
})

// a problem can only appear once in a given playlist

problemPlaylistSchema.index({playlistId: 1, problemId: 1}, {unique: true});

export const ProblemPlaylist = mongoose.model("ProblemPlaylist", problemPlaylistSchema)