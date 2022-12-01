import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const Quiz = async (req, res, next) => {
  try {
    const quiz = await prisma.quiz.findMany({
      include: {
        category: true,
      },
    })
    res.send(quiz)
  } catch (error) {
    next(error)
  }
}