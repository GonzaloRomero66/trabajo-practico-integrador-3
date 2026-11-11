import { matchedData } from "express-validator";
import categoryModel from "../models/category.model.js";
import eventModel from "../models/event.model.js";

export const GetAllCategory = async (req, res, next) => {
  try {
    const categories = await categoryModel.find();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

export const GetCategoryId = async (req, res, next) => {
  try {
    const category = await categoryModel
      .findById(req.params.id)
      .populate("events");

    if (!category) {
      return res.status(404).json({ message: "Categoria no encontrada" });
    }
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

export const CreateCategory = async (req, res, next) => {
  try {
    const data = matchedData(req, { locations: ["body"] });
    const category = await categoryModel.create(data);
    res
      .status(201)
      .json({ message: "Categoria creada correctamente", category });
  } catch (error) {
    next(error);
  }
};

export const UpdateCategory = async (req, res, next) => {
  try {
    const data = matchedData(req, { locations: ["body"] });
    const category = await categoryModel.findByIdAndUpdate(
      req.params.id,
      data,
      { returnDocument: "after", runValidators: true },
    );
    if (!category) {
      return res.status(404).json({ message: "Categoria no encontrada" });
    }
    res
      .status(200)
      .json({ message: "Categoria actualizada correctamente", category });
  } catch (error) {
    next(error);
  }
};

export const DeleteCategory = async (req, res, next) => {
  try {
    const category = await categoryModel.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Categoria no encontrada" });
    }

    // eliminacion en cascada: se quita la categoria de todos los eventos
    await eventModel.updateMany(
      { categories: category._id },
      { $pull: { categories: category._id } },
    );

    res.status(200).json({ message: "Categoria eliminada correctamente" });
  } catch (error) {
    next(error);
  }
};
