import useMutation from "@libs/client/useMutation";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "@components/input";
import Button from "@components/button";

interface signupForm {
  name: string;
  email: string;
}

interface MutationResult {
  ok: boolean;
}

export default () => {
  const [signup, { loading, data }] =
    useMutation<MutationResult>("/api/users/signup");
  const { register, handleSubmit } = useForm<signupForm>();

  const router = useRouter();

  useEffect(() => {
    if (data?.ok) {
      router.push("/log-in");
    }
  }, [data, router]);

  const onValid = (validForm: signupForm) => {
    if (loading) return;
    signup(validForm);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onValid)}></form>
      <div className="mt-16 px-4">
        <h3 className="text-3xl font-bold text-center">Welcome to Twitter</h3>
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
            <Input
              register={register("name", {
                required: true,
              })}
              name="name"
              label="Name"
              type="text"
              required
            />
            <Button text={"Sign Up"} />
          </form>
        </div>
      </div>
    </div>
  );
};
