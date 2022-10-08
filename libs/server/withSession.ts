import { IronSessionOptions } from "iron-session";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

const cookieConfig: IronSessionOptions = {
  cookieName: "carrotchallenge",
  password: process.env.COOKIE_PASSWORD!,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export function withApiSession(handler: any) {
  return withIronSessionApiRoute(handler, cookieConfig);
}

export function withSsrSession(handler: any) {
  return withIronSessionSsr(handler, cookieConfig);
}

export function signoutSession() {
  return withIronSessionApiRoute(
    (req: NextApiRequest, res: NextApiResponse) => {
      req.session.destroy();
      res.send({ ok: true });
    },
    cookieConfig
  );
}
