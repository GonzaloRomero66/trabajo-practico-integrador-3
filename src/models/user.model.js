import { Schema, model } from "mongoose";

const profileSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    birthDate: { type: Date },
    phone: { type: String, trim: true },
  },
  { _id: false, versionKey: false },
);
const userSchema = new Schema(
  {
    username: {
      required: true,
      type: String,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      required: true,
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      match: /.+\@.+\..+/,
    },
    password: {
      required: true,
      type: String,
      select: false,
    },
    profile: {
      type: profileSchema,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);
userSchema.virtual("events", {
  ref: "Event",
  localField: "_id",
  foreignField: "organizer",
});
const UserModel = model("User", userSchema);
export default UserModel;
