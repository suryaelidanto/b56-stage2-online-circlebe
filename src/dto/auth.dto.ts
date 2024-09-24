export type RegisterDTO = {
  fullName: string;
  email: string;
  password: string;
  image: string;
  username: string;
};

export type LoginDTO = {
  email: string;
  password: string;
};
