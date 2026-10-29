import { matchedData } from "express-validator";
import categoryModel from "../models/category.model.js";
export const GetAllCategory = async (req, res) => {
  try {
    const category = await categoryModel.find();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error al traer todas las categorias" });
  }
};
export const GetCategoryId = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Categoria no encontrada" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error al encontrar la categoria" });
  }
};

export const CreateCategory = async (req, res) => {
  try {
    const data = matchedData(req, { locations: ["body"] });
    const category = await categoryModel.create(data);
    res
      .status(201)
      .json({ message: "Categoria creada correctamente", category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al crear la categoria" });
  }
};

export const UpdateCategory = async (req, res) => {
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
      .status(201)
      .json({ message: "Categoria actualizada correctamente", category });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la categoria" });
  }
};
export const DeleteCategory = async (req, res) => {
  try {
    const category = await categoryModel.findByIdAndUpdate(req.params.id, {
      deleted: true,
      returnDocument: "after",
    });
    if (!category) {
      return res.status(404).json({ message: "Categoria no encontrada" });
    }
    res.json({ message: "categoria eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la categoria" });
  }
};
