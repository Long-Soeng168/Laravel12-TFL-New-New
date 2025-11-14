import React from "react";
import { motion } from "motion/react";
import { Link } from "@inertiajs/react";
import { ChevronDown, ChevronUp } from "lucide-react";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.a
        // href={item.toLowerCase() === "about us" ? '/' : `/${item.toLowerCase().replace(/\s+/g, '-')}`}
        transition={{ duration: 0.3 }}
        className="bg-true-primary text-sm whitespace-nowrap 2xl:text-xl 2xl:px-8 px-6 py-0.5 cursor-pointer font-proxima-nova-regular text-white hover:opacity-[0.9] dark:text-white flex gap-0.5 items-center"
      >
        {item}  <ChevronUp className="h-4 w-4 text-white dark:text-gray-300 transition-transform duration-300 rotate-180" />
      </motion.a>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute left-1/2 transform -translate-x-1/2 w-full">
              <motion.div
                transition={transition}
                layoutId="active" // layoutId ensures smooth animation
                className="bg-true-primary/80 backdrop-blur-sm overflow-hidden shadow-xl"
              >
                <motion.div
                  layout // layout ensures smooth animation
                  className="h-full p-2 font-proxima-nova-bold w-full"
                >
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}

        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)} // resets the state
      className="relative dark:bg-black  flex justify-between items-center space-x-2"
    >
        <div className="flex justify-between text-xs items-center space-x-2 ">
        {children}
        </div>

    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <Link href={href} className="flex space-x-2">
      <img
        src={src}
        width={140}
        height={70}
        alt={title}
        className="shrink-0 rounded-md object-cover shadow-xl"
      />
      <div>
        <h4 className="text-xl font-proxima-nova-bold font-bold mb-1 text-black dark:text-white">
          {title}
        </h4>
        <p className="text-neutral-700 text-sm max-w-[10rem] dark:text-neutral-300">
          {description}
        </p>
      </div>
    </Link>
  );
};

export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <Link
    prefetch
      {...rest}
      className="text-white text-[13px] 2xl:text-base max-w-32 hover:underline "
    >
      {children}
    </Link>
  );
};
