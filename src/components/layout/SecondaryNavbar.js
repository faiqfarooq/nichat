import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import useUserData from "@/hooks/useUserData";
import NotificationBar from "./NotificationBar";
import Avatar from "../ui/Avatar";
import { usePathname } from "next/navigation";

const SecondaryNavbar = () => {
  const { data: session } = useSession();
  const { user: userData } = useUserData();
  const pathname = usePathname();
  return (
    <>
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-dark-lighter border-b border-gray-700 px-4 py-3 flex items-center justify-between"
      >
        <div className="flex items-center">
          <button
            className="md:hidden mr-3 text-gray-400 hover:text-white transition-colors"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <Link
            href={pathname === "/dashboard" ? "/" : "/dashboard"}
            className="flex items-center group"
          >
            <div className="w-10 h-10 relative mr-2 overflow-hidden rounded-full bg-gradient-to-br from-primary to-primary-dark group-hover:from-primary-dark group-hover:to-primary transition-all duration-300">
              <svg
                className="absolute inset-0 w-10 h-10 text-white p-2 transform group-hover:scale-110 transition-transform duration-300"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </div>
            <h1 className="text-white font-semibold text-xl group-hover:text-primary transition-colors duration-300">
              nichat
            </h1>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/groups/new"
            className="text-gray-300 hover:text-primary relative rounded-full p-2 hover:bg-dark-light transition-all duration-300"
          >
            <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </Link>

          <Link
            href="/search"
            className="text-gray-300 hover:text-primary rounded-full p-2 hover:bg-dark-light transition-all duration-300"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </Link>

          <NotificationBar />

          <Link href="/profile" className="flex items-center group">
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", damping: 12 }}
                className="border-2 border-transparent group-hover:border-primary transition-all duration-300 cursor-pointer rounded-full"
              >
                <Avatar
                  src={userData?.avatar || session?.user?.avatar}
                  name={userData?.name || session?.user?.name || "User"}
                  size="md"
                />
              </motion.div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-lighter"></span>
            </div>
          </Link>
        </div>
      </motion.header>
    </>
  );
};

export default SecondaryNavbar;
