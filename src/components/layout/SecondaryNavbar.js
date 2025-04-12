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
        className="bg-dark-lighter w-full border-b border-gray-700 px-4 py-3 flex items-center justify-between"
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
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="/group/new"
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
