import {
  CloudArrowUpIcon,
  LockClosedIcon,
  ServerIcon,
} from "@heroicons/react/20/solid";
import { ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
export default function ListInfo() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  console.log("ListInfo component rendered");
  useEffect(() => {
    console.log("here in list info");
    if (!isAuthenticated) {
      console.log("not auth");
      navigate("/");
    }
  }, []);
  const { state } = useLocation();
  const book = state?.book;

  if (!isAuthenticated) return;
  if (!book) {
    return <div>No Book Data Available</div>;
  }
  const {
    title,
    author,
    publisher,
    publishYear,
    language,
    coverImage,
    firstSentence,
    subjects,
  } = book;
  if (isAuthenticated)
    return (
      // <></>
      <div
        className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0 "
        style={{ backgroundAttachment: "fixed" }}
      >
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <svg
            aria-hidden="true"
            className="absolute top-0 left-[max(50%,25rem)] h-[100vh] w-[100vw] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,#333,transparent)]"
          >
            <defs>
              <pattern
                x="50%"
                y={-1}
                id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                width={200}
                height={200}
                patternUnits="userSpaceOnUse"
              >
                <path d="M100 200V.5M.5 .5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
              <path
                d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect
              fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
              width="100%"
              height="100%"
              strokeWidth={0}
            />
          </svg>
        </div>
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="lg:max-w-lg">
                <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-indigo-600 sm:text-5xl">
                  <strong>Title: </strong>
                  {title || "Unknown Title"}
                </h1>
                <br />
                <p className="text-base/7 font-semibold text-gray-700">
                  <strong>Publishers: </strong>
                  {publisher || "Unknown Publisher"}
                </p>

                <p className="mt-6 text-xl/8 text-gray-700">
                  <strong>First Sentence: </strong>
                  {firstSentence ||
                    "Not available for this book. Check OpenLibrary for more details."}
                </p>
              </div>
            </div>
          </div>
          <div className="-mt-12 -ml-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
            <img
              alt={title || "Book Cover"}
              src={coverImage || null}
              className="w-[48rem] max-w-none rounded-xl bg-gray-900 ring-1 shadow-xl ring-gray-400/10 sm:w-[57rem]"
            />
          </div>
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
            <div className="lg:pr-4">
              <div className="max-w-xl text-base/7 text-gray-700 lg:max-w-lg">
                <p>
                  <strong>Author:</strong> {author || "Unknown Author"}
                </p>
                <p>
                  <strong>Year of Publication:</strong> {publishYear || "N/A"}
                </p>
                <p>
                  <strong>Language:</strong> {language || "Unknown"}
                </p>
                <ul role="list" className="mt-8 space-y-8 text-gray-600">
                  <strong>Subjects:</strong>
                  {subjects &&
                    subjects
                      .split(",")
                      .map((subject) => subject.trim()) // Trim each subject to remove extra spaces
                      .filter((subject) => subject.length > 0) // Filter out any empty subjects
                      .map((subject, index) => (
                        <li key={index} className="flex gap-x-3">
                          <ChevronRight
                            aria-hidden="true"
                            className="mt-1 size-5 flex-none text-indigo-600"
                          />
                          <span>{subject}</span>
                        </li>
                      ))}
                </ul>
                <p className="mt-8">
                  For more details, visit the OpenLibrary page for this book.
                </p>
                <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
                  Explore more about the book.
                </h2>
                <p className="mt-6">
                  This book offers a comprehensive look at its subject matter.
                  Dive into the story and experience the journey it has to
                  offer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
