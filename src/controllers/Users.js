import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

export const Register = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt)
    const user = await prisma.user.create({
      data: {
        username: username,
        password: hashPassword,
      }
    })

    if (user) {
      return res.send({ error: false, data: user })
    }
  } catch (error) {
    return res.send({ error: true, data: [] })
    // next(error)
  }
}

export const Login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        username,
      }
    })

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.send({ error: true, msg: "Password salah!" })
    }

    const { id, username: uname } = user;
    const accessToken = jwt.sign({ id, username: uname }, process.env.SECRET_TOKEN, {
      expiresIn: '30m'
    });

    const refreshToken = jwt.sign({ id, username: uname }, process.env.REFRESH_TOKEN, {
      expiresIn: '1d'
    });

    await prisma.user.update({
      where: {
        id: Number(id)
      },
      data: {
        refresh_token: refreshToken
      }
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      // secure: true
    });

    res.send({ error: false, accessToken })
  } catch (error) {
    return res.status(404).send({ error: true, msg: "User tidak ditemukan!" })
  }
}

export const Logout = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.status(204);
  const user = await prisma.user.findFirst({
    where: {
      refresh_token: refreshToken,
    }
  })

  if (!user) return res.status(204);
  const { id } = user;
  const updating = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      refresh_token: null
    }
  })

  res.clearCookie('refreshToken');
  return res.status(200).send({ error: false, msg: "Logout berhasil!" })
}

export const InsertScore = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const { score } = req.body;
    const checkScore = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        username: true,
        score: true,
      }
    });

    const { score: oldScore } = checkScore;

    if (Number(score) < Number(oldScore)) {
      return res.send({ error: false, msg: "Score baru lebih rendah dari score lama", data: checkScore });
    }

    const response = await prisma.user.update({
      where: {
        id: Number(id)
      },
      data: {
        score: score,
      }
    });

    if (!response) {
      return res.send({ error: true, data: [] })
    }
    return res.send({ error: false, data: response })
  } catch (error) {
    return res.send({ error: true, msg: error.message })
  }
}

export const Profile = async (req, res, next) => {
  try {
    const { username } = req;
    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
      select: {
        id: true,
        username: true,
        score: true,
        createdAt: true
      }
    })
    if (user) {
      return res.status(200).send({ error: false, data: user })
    }

    return res.status(404).send({ error: true, data: [] })
  } catch (error) {
    return res.status(500).send({ error: true, msg: error.message, data: [] })
    // next(error)
  }
}