import { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      unique: true,
      match: /.+\@.+\..+/,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profile: {
      firstName: {
        type: String,
        minlength: 2,
        maxlength: 50,
      },
      lastName: {
        type: String,
        minlength: 2,
        maxlength: 50,
      },
      birthData: {
        type: Date,
        optional: true,
      },
      phone: {
        type: String,
        optional: true,
      },
      deletedAt: {
        type: Date,
        default: null,
      },
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);
userSchema.virtual("events", {
  ref: "Event",
  localField: "_id",
  foreignField: "organizer",
});
const userModel = model("user", userSchema);
export default userModel;
