import mongoose from "mongoose";
import { Setting as SettingType } from "../types/setting";

const settingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    setting: {},
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model<SettingType>("Setting", settingSchema);

export default Setting;