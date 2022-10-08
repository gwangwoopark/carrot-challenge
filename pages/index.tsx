import type { NextPage } from "next";
import FloatingButton from "@components/floating-button";
import Item from "@components/tweet";
import Layout from "@components/layout";
import useSWR, { SWRConfig } from "swr";
import { Tweet } from "@prisma/client";
import client from "@libs/server/client";
import useUser from "@libs/client/useUser";

export interface TweetWithCount extends Tweet {
  user: {
    name: string;
  };
  _count: {
    favs: number;
  };
}

interface TweetsResponse {
  ok: boolean;
  tweets: TweetWithCount[];
}

const Home: NextPage = () => {
  const { user, isLoading } = useUser();
  const { data } = useSWR<TweetsResponse>("/api/tweets");
  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <Layout title="Twitter">
      <div className="flex flex-col space-y-5 divide-y">
        {data
          ? data?.tweets?.map((tweet) => (
              <Item
                id={tweet.id}
                key={tweet.id}
                text={tweet.text}
                author={tweet.user.name}
                hearts={tweet._count?.favs || 0}
              />
            ))
          : "Loading..."}
        <FloatingButton href="/tweet/upload">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

const Page: NextPage<{ tweets: TweetWithCount[] }> = ({ tweets }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/tweets": {
            ok: true,
            tweets,
          },
        },
      }}
    >
      <Home />
    </SWRConfig>
  );
};

export async function getServerSideProps() {
  const tweets = await client.tweet.findMany({});
  return {
    props: {
      products: JSON.parse(JSON.stringify(tweets)),
    },
  };
}

export default Page;
