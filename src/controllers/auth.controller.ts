import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { Request, Response } from "express";
import jwt, { decode } from "jsonwebtoken";
import authService from "../services/auth.service";
import { GoogleOAuthCallback } from "../types/oauth/google";
import { loginSchema, registerSchema } from "../utils/schemas/auth.schema";
import { LoginDTO } from "../dto/auth.dto";
import { CustomError, CustomErrorCode } from "../types/error";

const prisma = new PrismaClient();

class AuthController {
  async login(req: Request, res: Response) {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/LoginDTO"
                    }  
                }
            }
        } 
    */

    try {
      const value = await loginSchema.validateAsync(req.body);
      const user = await authService.login(value);
      res.json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async register(req: Request, res: Response) {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/RegisterDTO"
                    }  
                }
            }
        } 
    */

    try {
      const value = await registerSchema.validateAsync(req.body);
      await authService.register(value);
      const user = await authService.login(value);
      res.json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async check(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      res.json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async googleOAuth(req: Request, res: Response) {
    const GOOGLE_OAUTH_URL = process.env.GOOGLE_OAUTH_URL;
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_CALLBACK_URL =
      "http%3A//localhost:5000/api/v1/google/callback";
    const GOOGLE_OAUTH_SCOPES = [
      "https%3A//www.googleapis.com/auth/userinfo.email",
      "https%3A//www.googleapis.com/auth/userinfo.profile",
    ];

    const state = "halobang";
    const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
    const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${GOOGLE_OAUTH_URL}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_CALLBACK_URL}&access_type=offline&response_type=code&state=${state}&scope=${scopes}`;

    res.redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL);
  }

  async googleOAuthCallback(req: Request, res: Response) {
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const GOOGLE_ACCESS_TOKEN_URL = process.env.GOOGLE_ACCESS_TOKEN_URL!;
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

    const { code } = req.query;

    const data = {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: "http://localhost:5000/api/v1/google/callback",
      grant_type: "authorization_code",
    };

    const response = await axios.post(GOOGLE_ACCESS_TOKEN_URL, data);

    const { email, name } = decode(
      response.data.id_token
    ) as GoogleOAuthCallback;

    const googleUser = await prisma.user.findUnique({
      where: {
        email: email,
        socialConnection: "GOOGLE",
      },
    });

    const secretKey = process.env.JWT_SECRET as string;

    if (!googleUser) {
      const user = await prisma.user.create({
        data: {
          email: email,
          fullName: name,
          socialConnection: "GOOGLE",
        },
      });

      const { password, ...userToSign } = user;

      const token = jwt.sign(userToSign, secretKey);

      return res.redirect(`/?accessToken=${token}`); //TODO: redirect to frontend + bring the accessToken and refreshToken
    }

    const { password, ...userToSign } = googleUser;

    const token = jwt.sign(userToSign, secretKey);

    res.redirect(`/?accessToken=${token}`); //TODO: redirect to frontend + bring the accessToken and refreshToken
  }
}

export default new AuthController();
