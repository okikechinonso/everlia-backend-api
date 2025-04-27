import { Request, Response } from "express";
import Attribute from "../models/Attribute";
import { handleProductAttribute } from "../lib/stock-controller/others";
import { AttributeVariant } from "../types/attributes";

export const addAttribute = async (req: Request, res: Response) => {
  try {
    const newAttribute = new Attribute(req.body);
    await newAttribute.save();
    res.send({
      message: "Attribute Added Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: `Error occurred when adding attribute: ${(err as Error).message}`,
    });
  }
};

export const addChildAttributes = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const attribute = await Attribute.findById(id);
    await Attribute.updateOne(
      { _id: attribute?._id },
      { $push: { variants: req.body } }
    );
    res.send({
      message: "Attribute Value Added Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const addAllAttributes = async (req: Request, res: Response) => {
  try {
    await Attribute.deleteMany();
    await Attribute.insertMany(req.body);
    res.send({
      message: "Added all attributes successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const getAllAttributes = async (req: Request, res: Response) => {
  try {
    const { type, option, option1 } = req.query;
    const attributes = await Attribute.find({
     $or: [{ type }, { $or: [{ option }, { option: option1 }] }],
    });
    res.send(attributes);
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const getShowingAttributes = async (req: Request, res: Response) => {
  try {
    const attributes = await Attribute.aggregate([
      {
        $match: {
          status: "show",
          "variants.status": "show",
        },
      },
      {
        $project: {
          _id: 1,
          status: 1,
          title: 1,
          name: 1,
          option: 1,
          createdAt: 1,
          updateAt: 1,
          variants: {
            $filter: {
              input: "$variants",
              cond: {
                $eq: ["$$this.status", "show"],
              },
            },
          },
        },
      },
    ]);
    res.send(attributes);
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const updateAttributes = async (req: Request, res: Response) => {
  try {
    const attribute = await Attribute.findById(req.params.id);
    if (attribute) {
      attribute.title = { ...attribute.title, ...req.body.title };
      attribute.name = { ...attribute.name, ...req.body.name };
      attribute.option = req.body.option;
      attribute.type = req.body.type;
      await attribute.save();
      res.send({
        message: "Attribute updated successfully!",
      });
    } else {
      res.status(404).send({
        message: "Attribute not found!",
      });
    }
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const updateChildAttributes = async (req: Request, res: Response) => {
  try {
    const { attributeId, childId } = req.params;

    const attribute = await Attribute.findOne({
      _id: attributeId,
      "variants._id": childId,
    });

    if (attribute) {
      const att = attribute.variants.find((v: AttributeVariant) => v._id.toString() === childId);
      if (!att) {
        return res.status(404).send({
          message: "Attribute value not found!",
        });
      }
      const name = {
        ...att.name,
        ...req.body.name,
      };

      await Attribute.updateOne(
        { _id: attributeId, "variants._id": childId },
        {
          $set: {
            "variants.$.name": name,
            "variants.$.status": req.body.status,
          },
        }
      );
    }

    res.send({
      message: "Attribute Value Updated Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const updateManyChildAttribute = async (req: Request, res: Response) => {
  try {
    const childIdAttribute = await Attribute.findById(req.body.currentId);

    const final = childIdAttribute?.variants.filter((value: AttributeVariant) =>
      req.body.ids.find((value1: string) => value1 === value._id.toString())
    );

    const updateStatusAttribute = final?.map((value: AttributeVariant) => {
      value.status = req.body.status;
      return value;
    });

    let totalVariants: AttributeVariant[] = [];
    if (req.body.changeId) {
      const groupIdAttribute = await Attribute.findById(req.body.changeId);
      totalVariants = [...(groupIdAttribute?.variants || []), ...(updateStatusAttribute || [])];
    }

    if (totalVariants.length === 0) {
      await Attribute.updateOne(
        { _id: req.body.currentId },
        {
          $set: {
            variants: childIdAttribute?.variants,
          },
        },
        {
          multi: true,
        }
      );
    } else {
      await Attribute.updateOne(
        { _id: req.body.changeId },
        {
          $set: {
            variants: totalVariants,
          },
        },
        {
          multi: true,
        }
      );

      await Attribute.updateOne(
        { _id: req.body.currentId },
        {
          $pull: { variants: { _id: { $in: req.body.ids } } },
        },
        {
          multi: true,
        }
      );
    }

    res.send({
      message: "Attribute Values updated successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const newStatus = req.body.status;
    await Attribute.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: newStatus,
        },
      }
    );
    res.status(200).send({
      message: `Attribute ${
        newStatus === "show" ? "Published" : "Un-Published"
      } Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const deleteAttribute = async (req: Request, res: Response) => {
  try {
    await Attribute.deleteOne({ _id: req.params.id });
    res.send({
      message: "Attribute Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const deleteChildAttribute = async (req: Request, res: Response) => {
  try {
    const { attributeId, childId } = req.params;

    await Attribute.updateOne(
      { _id: attributeId },
      { $pull: { variants: { _id: childId } } }
    );

    await handleProductAttribute(attributeId, childId);
    res.send({
      message: "Attribute Value Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const deleteManyAttribute = async (req: Request, res: Response) => {
  try {
    await Attribute.deleteMany({ _id: { $in: req.body.ids } });
    res.send({
      message: "Attributes Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const deleteManyChildAttribute = async (req: Request, res: Response) => {
  try {
    await Attribute.updateOne(
      { _id: req.body.id },
      {
        $pull: { variants: { _id: { $in: req.body.ids } } },
      },
      {
        multi: true,
      }
    );

    await handleProductAttribute(req.body.id, req.body.ids, true);
    res.send({
      message: "Attribute Values Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};
