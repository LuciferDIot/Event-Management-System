import { IUserEvent } from "@/types";
import { Model, Schema, model, models } from "mongoose";

const UserEventSchema = new Schema<IUserEvent>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Overdue"],
      default: "Pending",
    }, // Tracking the status of the user's participation
    note: { type: String }, // Optional note related to the user's participation
  },
  { timestamps: true }
); // Automatically manages createdAt and updatedAt fields

const UserEvent: Model<IUserEvent> =
  models.UserEvent || model("UserEvent", UserEventSchema);

export default UserEvent;
