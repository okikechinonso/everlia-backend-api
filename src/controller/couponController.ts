import { Request, Response } from "express";
import Category from "../models/Category";

export const addCategory = async (req: Request, res: Response) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(200).send({
      message: "Category Added Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const addAllCategory = async (req: Request, res: Response) => {
  try {
    await Category.deleteMany();
    await Category.insertMany(req.body);
    res.status(200).send({
      message: "Categories Added Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const getShowingCategory = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({ status: "show" }).sort({ _id: -1 });
    const categoryList = readyToParentAndChildrenCategory(categories);
    res.send(categoryList);
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const getAllCategory = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({}).sort({ _id: -1 });
    const categoryList = readyToParentAndChildrenCategory(categories);
    res.send(categoryList);
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({}).sort({ _id: -1 });
    res.send(categories);
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    res.send(category);
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      category.name = { ...category.name, ...req.body.name };
      category.description = { ...category.description, ...req.body.description };
      category.icon = req.body.icon;
      category.status = req.body.status;
      category.parentId = req.body.parentId || category.parentId;
      category.parentName = req.body.parentName;

      await category.save();
      res.send({ message: "Category Updated Successfully!" });
    } else {
      res.status(404).send({ message: "Category Not Found!" });
    }
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const updateManyCategory = async (req: Request, res: Response) => {
  try {
    const updatedData: Record<string, any> = {};
    for (const key of Object.keys(req.body)) {
      if (
        req.body[key] !== "[]" &&
        Object.entries(req.body[key]).length > 0 &&
        req.body[key] !== req.body.ids
      ) {
        updatedData[key] = req.body[key];
      }
    }

    await Category.updateMany(
      { _id: { $in: req.body.ids } },
      { $set: updatedData },
      { multi: true }
    );

    res.send({
      message: "Categories Updated Successfully!",
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

    await Category.updateOne(
      { _id: req.params.id },
      { $set: { status: newStatus } }
    );

    res.status(200).send({
      message: `Category ${
        newStatus === "show" ? "Published" : "Un-Published"
      } Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await Category.deleteOne({ _id: req.params.id });
    await Category.deleteMany({ parentId: req.params.id });
    res.status(200).send({
      message: "Category Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

export const deleteManyCategory = async (req: Request, res: Response) => {
  try {
    await Category.deleteMany({ parentId: req.body.ids });
    await Category.deleteMany({ _id: req.body.ids });
    res.status(200).send({
      message: "Categories Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: (err as Error).message,
    });
  }
};

const readyToParentAndChildrenCategory = (
  categories: any[],
  parentId: string | null = null
): any[] => {
  const categoryList: any[] = [];
  let filteredCategories;

  if (parentId === null) {
    filteredCategories = categories.filter((cat) => !cat.parentId);
  } else {
    filteredCategories = categories.filter((cat) => cat.parentId === parentId);
  }

  for (const cate of filteredCategories) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      parentId: cate.parentId,
      parentName: cate.parentName,
      description: cate.description,
      icon: cate.icon,
      status: cate.status,
      children: readyToParentAndChildrenCategory(categories, cate._id),
    });
  }

  return categoryList;
};