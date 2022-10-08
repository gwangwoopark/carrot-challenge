import type { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";
import { Tweet } from "@prisma/client";
import { useRouter } from "next/router";

interface UploadTweetForm {
  text: string;
}

interface UploadTweetMutation {
  ok: boolean;
  tweet: Tweet;
}

const Upload: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<UploadTweetForm>();
  const [uploadTweet, { loading, data }] =
    useMutation<UploadTweetMutation>("/api/tweets");
  const onValid = async ({ text }: UploadTweetForm) => {
    if (loading) return;
    uploadTweet({ text });
  };
  useEffect(() => {
    if (data?.ok) {
      router.replace(`/tweet/${data.tweet.id}`);
    }
  }, [data, router]);
  return (
    <Layout canGoBack title="Upload Tweet">
      <form className="p-4 space-y-4" onSubmit={handleSubmit(onValid)}>
        <TextArea
          register={register("text", { required: true, maxLength: 140 })}
          name="text"
          label="What are you thinking?"
          required
          maxLength={140}
        />
        <Button text={loading ? "Loading..." : "Tweet"} />
      </form>
    </Layout>
  );
};

export default Upload;
