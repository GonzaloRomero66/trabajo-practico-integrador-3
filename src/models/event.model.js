import { Schema, model } from "mongoose";

const locationSchema = new Schema(
  {
    venue: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 150,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
  },
  { _id: false, versionKey: false },
);

const eventSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      minlength: 3,
      maxlength: 150,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      minlength: 20,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          if (!this.startDate) return true;
          return value > this.startDate;
        },
        message: "La fecha de finalización debe ser posterior a la de inicio",
      },
    },
    capacity: {
      type: Number,
      min: 1,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "La capacidad debe ser un entero",
      },
    },
    price: {
      type: Number,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      enum: ["scheduled", "cancelled", "finished"],
      default: "scheduled",
    },
    location: {
      type: locationSchema,
      required: true,
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
const EventModel = model("Event", eventSchema);
export default EventModel;
