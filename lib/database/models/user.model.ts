import { IUser, UserRole } from "@/types";
import bcrypt from "bcrypt";
import { Model, Schema, model, models } from "mongoose";

const UserSchema = new Schema<IUser>({
  role: { type: String, default: UserRole.User },
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true },
});

// Pre-save hook to hash passwords
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User: Model<IUser> = models.User || model("User", UserSchema);

export default User;
