import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "@components/input";
import Button from "@components/button";

interface signinForm {
  email: string;
}

interface MutationResult {
  ok: boolean;
}

export default () => {
  const [signin, { loading, data }] =
    useMutation<MutationResult>("/api/users/signin");
  const { register, handleSubmit } = useForm<signinForm>();

  const router = useRouter();
  useEffect(() => {
    if (data?.ok) {
      router.push("/");
    }
  }, [data, router]);
  const onValid = (validForm: signinForm) => {
    if (loading) return;
    signin(validForm);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onValid)}></form>
      <div className="mt-16 px-4">
        <h3 className="text-3xl font-bold text-center">Welcome Back!</h3>
        <div className="mt-12">
          <form
            onSubmit={handleSubmit(onValid)}
            className="flex flex-col mt-8 space-y-4"
          >
            <Input
              register={register("email", {
                required: true,
              })}
              name="email"
              label="Email address"
              type="email"
              required
            />
            <Button text={"Sign In"} />
          </form>
        </div>
      </div>
    </div>
  );
};
