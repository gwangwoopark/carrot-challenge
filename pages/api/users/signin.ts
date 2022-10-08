import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { email } = req.body;
  const user = await client.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return res
      .status(400)
      .json({ ok: false, error: "The user does not exist" });
  }
  req.session.user = {
    id: user.id,
  };
  await req.session.save();
  res.status(200).json({
    ok: true,
  });
}

export default withApiSession(
  withHandler({ methods: ["POST"], handler, isPrivate: false })
);
