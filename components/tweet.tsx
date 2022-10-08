import Link from "next/link";

interface TweetProps {
  id: number;
  text: string;
  hearts: number;
  author: string;
}

export default function Tweet({ id, text, hearts, author }: TweetProps) {
  return (
    <Link href={`/tweet/${id}`}>
      <a className="px-10 pt-8 cursor-pointer">
        <div className="flex space-x-4">
          <div className="w-full h-full relative rounded-md break-words">
            {text}
          </div>
        </div>
        <div className="flex space-x-2 items-end justify-end">
          <div className="italic pr-2">@{author}</div>
          <div className="flex space-x-0.5 items-center text-sm  text-gray-600">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
            <span>{hearts}</span>
          </div>
        </div>
      </a>
    </Link>
  );
}
