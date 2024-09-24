import { PrismaClient, User } from "@prisma/client";
import { CreateUserDTO, UpdateUserDTO } from "../dto/user.dto";
import { CustomError, CustomErrorCode } from "../types/error";

const prisma = new PrismaClient();

class UserService {
  async getAllUsers(): Promise<User[]> {
    return await prisma.user.findMany();
  }

  async getUserById(id: number): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw {
        status: 404,
        message: "User not found!",
        code: CustomErrorCode.USER_NOT_EXISTS,
      } as CustomError;
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async createUser(data: CreateUserDTO): Promise<User | null> {
    return await prisma.user.create({ data });
  }

  async updateUser(data: UpdateUserDTO): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id: 2, //TODO: ambil data id dari hasil decode token
      },
    });

    if (!user) {
      throw {
        status: 404,
        message: "User not found!",
        code: CustomErrorCode.USER_NOT_EXISTS,
      } as CustomError;
    }

    if (data.fullName) {
      user.fullName = data.fullName;
    }

    if (data.password) {
      user.password = data.password;
    }

    return await prisma.user.update({
      data: user,
      where: { id: 2 },
    });
  }

  async deleteUser(id: number): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw {
        status: 404,
        message: "User not found!",
        code: CustomErrorCode.USER_NOT_EXISTS,
      } as CustomError;
    }

    return await prisma.user.delete({
      where: { id },
    });
  }
}

export default new UserService();
