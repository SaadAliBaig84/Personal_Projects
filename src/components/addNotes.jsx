import BookList from "./list";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
// import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons";
import { X, Bell, Tally3, List, Book } from "lucide-react";
//import { BooksProvider } from "./booksContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";
import { login, logout } from "./authSlice";
import { useDispatch } from "react-redux";
import NewNotes from "./newNote";
import { useLocation } from "react-router-dom";
import ExistingNotes from "./existingNotes";
const navigation = [
  { name: "Existing Notes", href: "", current: true },
  { name: "New Notes", href: "", current: false },
  // { name: "Projects", href: "", current: false },
  // { name: "Calendar", href: "", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Notes() {
  const dispatch = useDispatch();
  let isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [activeTab, setActiveTab] = useState("Existing Notes");
  const { state } = useLocation();

  useEffect(() => {
    console.log(state?.book.title);
  }, []);
  return (
    <>
      <Disclosure as="nav" className="bg-indigo-400">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button*/}
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 bg-indigo-800 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Tally3
                  aria-hidden="true"
                  className="block size-6 group-data-open:hidden"
                />
                <X
                  aria-hidden="true"
                  className="hidden size-6 group-data-open:block"
                />
              </DisclosureButton>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                {/* <img
                  alt="Your Company"
                  src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
                  className="h-8 w-auto"
                /> */}
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        setActiveTab(item.name);
                      }}
                      className={classNames(
                        item.name === activeTab
                          ? "bg-indigo-800 text-white"
                          : "text-gray-300 hover:bg-indigo-600 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium"
                      )}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                }}
                className={classNames(
                  item.name === activeTab
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "block rounded-md px-3 py-2 text-base font-medium"
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>
        </DisclosurePanel>
      </Disclosure>
      {activeTab === "New Notes" && <NewNotes book={state?.book} />}
      {activeTab === "Existing Notes" && <ExistingNotes book={state?.book} />}
    </>
  );
}
