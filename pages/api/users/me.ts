import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const user = await client.user.findUnique({
    where: {
      id: req.session.user?.id,
    },
  });
  if (user) {
    return res.status(200).json({
      ok: true,
      profile: user,
    });
  } else {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
