const categorySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      minlength: 2,
      maxlength: 30,
    },
    description: {
      type: String,
      optional: true,
      maxlength: 200,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

categorySchema.virtual("Events", {
  ref: "Events",
  localField: "_id",
  foreignField: "categories",
});
