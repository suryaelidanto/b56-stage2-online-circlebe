import { Request, Response } from "express";
import threadService from "../services/thread.service";
import { createThreadSchema } from "../utils/schemas/thread.schema";

class ThreadController {
  async find(req: Request, res: Response) {
    try {
      const threads = await threadService.getAllThreads();
      res.json(threads);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const threads = await threadService.getThreadById(Number(id));
      res.json(threads);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async create(req: Request, res: Response) {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/CreateThreadDTO"
                    }  
                }
            }
        } 
    */

    try {
      const value = await createThreadSchema.validateAsync(req.body);

      const threads = await threadService.createThread(value);
      res.json(threads);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async update(req: Request, res: Response) {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/UpdateThreadDTO"
                    }  
                }
            }
        } 
    */
    try {
      const threads = await threadService.updateThread(req.body);
      res.json(threads);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const threads = await threadService.deleteThread(Number(id));
      res.json(threads);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

export default new ThreadController();
