import { Request, Response } from "express";
import userService from "../services/user.service";
import { createUserSchema } from "../utils/schemas/user.schema";

class UserController {
  async find(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const users = await userService.getUserById(Number(id));
      res.json(users);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async findByEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;

      const users = await userService.getUserByEmail(email);
      res.json(users);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const value = await createUserSchema.validateAsync(req.body);

      const users = await userService.createUser(value);
      res.json(users);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const users = await userService.updateUser(req.body);
      res.json(users);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const users = await userService.deleteUser(Number(id));
      res.json(users);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

export default new UserController();
