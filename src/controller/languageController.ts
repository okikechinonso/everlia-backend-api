import { Request, Response } from "express";
import Language from "../models/Language";

export const addLanguage = async (req: Request, res: Response): Promise<void> => {
  try {
    const newLanguage = new Language(req.body);
    await newLanguage.save();
    res.send({
      message: "Language added successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const addAllLanguage = async (req: Request, res: Response): Promise<void> => {
  try {
    await Language.insertMany(req.body);
    res.send({ message: "All languages added successfully!" });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const getAllLanguages = async (req: Request, res: Response): Promise<void> => {
  try {
    const languages = await Language.find({});
    res.send(languages);
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const getShowingLanguage = async (req: Request, res: Response): Promise<void> => {
  try {
    const languages = await Language.find({ status: "show" }).sort({ _id: -1 });
    res.send(languages);
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const getLanguageById = async (req: Request, res: Response): Promise<void> => {
  try {
    const language = await Language.findById(req.params.id);
    res.send(language);
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const updateLanguage = async (req: Request, res: Response): Promise<void> => {
  try {
    const language = await Language.findById(req.params.id);
    if (language) {
      language.name = req.body.name;
      language.iso_code = req.body.iso_code;
      language.flag = req.body.flag;
      language.status = req.body.status;
      await language.save();
      res.send({
        message: "Language updated successfully!",
      });
    } else {
      res.status(404).send({
        message: "Language not found!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const updateManyLanguage = async (req: Request, res: Response): Promise<void> => {
  try {
    await Language.updateMany(
      { _id: { $in: req.body.ids } },
      {
        $set: {
          status: req.body.status,
        },
      },
      {
        multi: true,
      }
    );

    res.send({
      message: "Languages updated successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const newStatus = req.body.status;

    await Language.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: newStatus,
        },
      }
    );
    res.status(200).send({
      message: `Language ${
        newStatus === "show" ? "Published" : "Un-Published"
      } successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const deleteLanguage = async (req: Request, res: Response): Promise<void> => {
  try {
    await Language.deleteOne({ _id: req.params.id });
    res.send({
      message: "Language deleted successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const deleteManyLanguage = async (req: Request, res: Response): Promise<void> => {
  try {
    await Language.deleteMany({ _id: req.body.ids });
    res.send({
      message: "Languages deleted successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};