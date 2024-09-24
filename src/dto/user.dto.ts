export type CreateUserDTO = {
  fullName: string;
  email: string;
  password: string;
};

export type UpdateUserDTO = Omit<CreateUserDTO, "email">