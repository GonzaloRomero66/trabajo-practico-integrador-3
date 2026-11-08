import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      required: true,
      type: String,
      unique: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      required: true,
      type: String,
      unique: true,
      match: /.+\@.+\..+/,
    },
    password: {
      required: true,
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
      birthDate: {
        type: Date,
        optional: true,
      },
      phone: {
        type: String,
        optional: true,
      },
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
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
