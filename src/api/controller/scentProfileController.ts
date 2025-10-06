import { Request, Response } from "express";
import ScentProfile from "../../models/ScentProfile";

export const createScentProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload = req.body;
    const sp = new ScentProfile({ ...payload });
    await sp.save();
    res.status(201).send(sp);
  } catch (err) {
    res.status(500).send({ message: (err as Error).message });
  }
};

export const getAllScentProfiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const profiles = await ScentProfile.find().sort({ createdAt: -1 });
    res.send(profiles);
  } catch (err) {
    res.status(500).send({ message: (err as Error).message });
  }
};

export const getScentProfileById = async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = await ScentProfile.findById(req.params.id);
    if (!profile) {
      res.status(404).send({ message: "ScentProfile not found" });
      return;
    }
    res.send(profile);
  } catch (err) {
    res.status(500).send({ message: (err as Error).message });
  }
};

export const updateScentProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = await ScentProfile.findById(req.params.id);
    if (!profile) {
      res.status(404).send({ message: "ScentProfile not found" });
      return;
    }
    profile.set(req.body);
    await profile.save();
    res.send(profile);
  } catch (err) {
    res.status(500).send({ message: (err as Error).message });
  }
};

export const deleteScentProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    await ScentProfile.deleteOne({ _id: req.params.id });
    res.send({ message: "ScentProfile deleted" });
  } catch (err) {
    res.status(500).send({ message: (err as Error).message });
  }
};
