import { PrismaClient, Thread } from "@prisma/client";
import { CreateThreadDTO, UpdateThreadDTO } from "../dto/thread.dto";
import { CustomError, CustomErrorCode } from "../types/error";

const prisma = new PrismaClient();

class ThreadService {
  async getAllThreads(): Promise<Thread[]> {
    return await prisma.thread.findMany({
      include: {
        user: true,
      },
    });
  }

  async getThreadById(id: number): Promise<Thread | null> {
    const thread = await prisma.thread.findUnique({
      where: {
        id: id,
      },
    });

    if (!thread) {
      throw {
        status: 404,
        message: "Thread not found!",
        code: CustomErrorCode.USER_NOT_EXISTS,
      } as CustomError;
    }

    return thread;
  }

  async createThread(data: CreateThreadDTO): Promise<Thread | null> {
    return await prisma.thread.create({
      data: {
        ...data,
        userId: 1,
      },
    });
  }

  async updateThread(data: UpdateThreadDTO): Promise<Thread | null> {
    const thread = await prisma.thread.findUnique({
      where: {
        id: data.id,
      },
    });

    if (!thread) {
      throw {
        status: 404,
        message: "Thread not found!",
        code: CustomErrorCode.USER_NOT_EXISTS,
      } as CustomError;
    }

    if (data.content) {
      thread.content = data.content;
    }

    if (data.image) {
      thread.image = data.image;
    }

    return await prisma.thread.update({
      data: thread,
      where: { id: 2 },
    });
  }

  async deleteThread(id: number): Promise<Thread | null> {
    const thread = await prisma.thread.findUnique({
      where: { id },
    });

    if (!thread) {
      throw {
        status: 404,
        message: "Thread not found!",
        code: CustomErrorCode.USER_NOT_EXISTS,
      } as CustomError;
    }

    return await prisma.thread.delete({
      where: { id },
    });
  }
}

export default new ThreadService();
