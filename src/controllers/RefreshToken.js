import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const generateRefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401);
    const user = await prisma.user.findFirst({
      where: {
        refresh_token: refreshToken
      }
    });

    if (!user) return res.status(401);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
      if (err) return res.status(403);
      const { id, username } = user;
      const accessToken = jwt.sign({ id, username }, process.env.SECRET_TOKEN, {
        expiresIn: '30m',
      })

      res.send({ accessToken });
    })
  } catch (error) {
    next(error)
  }
}
