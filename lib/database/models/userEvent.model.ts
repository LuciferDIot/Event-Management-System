import { IUserEvent, UserEventStatus } from "@/types";
import { Model, Schema, model, models } from "mongoose";

const UserEventSchema = new Schema<IUserEvent>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    status: {
      type: String,
      enum: Object.values(UserEventStatus),
      default: UserEventStatus.Pending,
    }, // Tracking the status of the user's participation
  },
  { timestamps: true }
); // Automatically manages createdAt and updatedAt fields

const UserEvent: Model<IUserEvent> =
  models.UserEvent || model("UserEvent", UserEventSchema);

export default UserEvent;
