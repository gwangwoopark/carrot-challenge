import type { GetServerSideProps, NextPage } from "next";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Tweet, User } from "@prisma/client";
import useMutation from "@libs/client/useMutation";
import { classNames } from "@libs/client/utils";
import client from "@libs/server/client";
import { withSsrSession } from "@libs/server/withSession";

interface TweetWithUser extends Tweet {
  user: User;
}
interface ItemDetailResponse {
  ok: boolean;
  tweet: TweetWithUser;
  isLiked: boolean;
}

const ItemDetail: NextPage<ItemDetailResponse> = ({ tweet, isLiked }) => {
  const router = useRouter();
  const { data, mutate } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/tweets/${router.query.id}` : null
  );
  const [toggleFav] = useMutation(`/api/tweets/${router.query.id}/fav`);
  const onFavClick = () => {
    if (!data) return;
    mutate((prev) => {
      return prev && { ...prev, isLiked: !prev.isLiked };
    }, false);
    toggleFav({});
  };

  return (
    <Layout canGoBack title="Tweet Detail">
      <div className="px-10 py-4">
        <div className="mb-8">
          <div className="mt-5">
            <div className="italic text-3xl">@{tweet.user.name}</div>
            <p className=" mt-6 mb-2 text-gray-700 break-words">
              {tweet?.text}
            </p>
            <div className="flex items-center justify-end">
              <button
                onClick={onFavClick}
                className={classNames(
                  "p-3 rounded-md flex items-center hover:bg-gray-100 justify-center ",
                  data?.isLiked
                    ? "text-red-500  hover:text-red-600"
                    : "text-gray-400  hover:text-gray-500"
                )}
              >
                {data?.isLiked ? (
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 "
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const getServerSidePropsHandler: GetServerSideProps = async (ctx) => {
  const user = ctx?.req?.session?.user;

  if (!ctx?.params?.id || !user) {
    return {
      props: {},
    };
  }

  const tweet = await client.tweet.findUnique({
    where: {
      id: +ctx.params.id.toString(),
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });
  const isLiked = Boolean(
    await client.fav.findFirst({
      where: {
        tweetId: tweet?.id,
        userId: user?.id,
      },
      select: {
        id: true,
      },
    })
  );
  return {
    props: {
      tweet: JSON.parse(JSON.stringify(tweet)),
      isLiked,
    },
  };
};

export const getServerSideProps = withSsrSession(getServerSidePropsHandler);

export default ItemDetail;
