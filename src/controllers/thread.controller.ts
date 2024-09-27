import { Request, Response } from "express";
import threadService from "../services/thread.service";
import { createThreadSchema } from "../utils/schemas/thread.schema";
import cloudinaryService from "../services/cloudinary.service";
import { redisClient } from "../libs/redis-client";
import { amqplibChannel } from "../libs/rabbitmq/rabbitmq";
import { CIRCLE_QUEUE } from "../libs/rabbitmq/rabbitmq.constant";

class ThreadController {
  async find(req: Request, res: Response) {
    try {
      const redisThreads = await redisClient.get("THREADS_DATA");
      if (redisThreads) return res.json(JSON.parse(redisThreads));

      const threads = await threadService.getAllThreads();
      await redisClient.set("THREADS_DATA", JSON.stringify(threads));
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

  async enqueue(req: Request, res: Response) {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "multipart/form-data": {
                    schema: {
                        $ref: "#/components/schemas/CreateThreadDTO"
                    }  
                }
            }
        } 
    */
    const user = (req as any).user;

    const body = {
      ...req.body,
      image: req.file?.path,
    };

    const data = await createThreadSchema.validateAsync(body);

    amqplibChannel.assertQueue(CIRCLE_QUEUE.THREAD);
    amqplibChannel.sendToQueue(
      CIRCLE_QUEUE.THREAD,
      Buffer.from(JSON.stringify({ data, user }))
    );

    res.send("Threads enqueued!");
  }

  async dequeue(payload: any) {
    try {
      await cloudinaryService.uploadSingleDisk(payload.data.image);
      // await threadService.createThread(payload.data, payload.user);

      console.log(`Thread created! ${JSON.stringify(payload)}`);
    } catch (error) {
      console.error(error);
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
