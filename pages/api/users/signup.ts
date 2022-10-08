import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { name, email } = req.body;
  const user = await client.user.create({
    data: {
      name,
      email,
    },
  });
  if (user) {
    return res.status(200).json({
      ok: true,
    });
  } else {
    return res
      .status(400)
      .json({ ok: false, error: "The email address is already used" });
  }
}

export default withHandler({ methods: ["POST"], handler, isPrivate: false });
