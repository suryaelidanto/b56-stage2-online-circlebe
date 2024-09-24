import Joi from "joi";
import { CreateThreadDTO } from "../../dto/thread.dto";

export const createThreadSchema = Joi.object<CreateThreadDTO>({
  content: Joi.string(),
  image: Joi.string(),
});
