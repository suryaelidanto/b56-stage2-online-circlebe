export type CreateThreadDTO = {
  content: string;
  image?: string;
};

export type UpdateThreadDTO = CreateThreadDTO & {
  id: number;
};
