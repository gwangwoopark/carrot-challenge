import React from "react";
import { classNames } from "@libs/client/utils";
import { useRouter } from "next/router";
import Head from "next/head";

interface LayoutProps {
  title?: string;
  canGoBack?: boolean;
  children: React.ReactNode;
}

export default function Layout({ title, canGoBack, children }: LayoutProps) {
  const router = useRouter();
  const onClick = () => {
    router.back();
  };
  console.log(title);
  return (
    <div className="mb-10">
      <Head>
        <title>Twitter</title>
      </Head>

      <div className="bg-white w-full h-12 max-w-xl justify-center text-lg px-20 font-medium  fixed text-gray-800 border-b top-0  flex items-center z-10">
        {canGoBack && (
          <button onClick={onClick} className="absolute left-4">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
        )}
        {title && <div>{title}</div>}
      </div>

      <div className={classNames("pt-12")}>{children}</div>
    </div>
  );
}
