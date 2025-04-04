import { Fragment, useContext, useEffect, useMemo, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import {
  FaBars,
  FaBox,
  FaShoppingCart,
  FaWarehouse,
  FaTachometerAlt,
} from "react-icons/fa";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { IoArrowBackSharp } from "react-icons/io5";

import { RiCloseLargeLine, RiMenu2Fill } from "react-icons/ri";

import { IconType } from "react-icons/lib";
import { twMerge } from "tailwind-merge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BiCollapseAlt } from "react-icons/bi";

import { AuthContext } from "@/context/authContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { toast } from "sonner";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function Sidebar({ children }: { children: React.ReactNode }) {
  const { user } = useContext(AuthContext);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const sidebarRoutes = useMemo(
    () => [
      {
        to: "/dashboard",
        Icon: FaTachometerAlt,
        text: "Dashboard",
      },
      // {
      //   to: "finance",
      //   Icon: FaChartLine,
      //   text: "Financial Activity",
      // },
      {
        to: "stock",
        Icon: FaWarehouse,
        text: "Stock & Sell",
      },
      {
        to: "sales",
        Icon: FaShoppingCart,
        text: "Sales Data",
      },

      {
        to: "expense",
        Icon: FaMoneyCheckDollar,
        text: "Daily Expense",
      },
      {
        to: "products",
        Icon: FaBox,
        text: "Products Entry",
      },
    ],
    []
  ) as { to: string; Icon: IconType; text: string }[];

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname === "/") {
      navigate("/dashboard");
    }
  }, [pathname, navigate]);
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        toast("You are now Logged Out");
        navigate("/");
      })
      .catch((err) => {
        toast("Failed to Log Out! ", { description: String(err) });
      });
  };
  return (
    <Fragment>
      {user && (
        <div
          aria-hidden={false}
          className="flex h-screen overflow-hidden bg-gray-100 dark:bg-background relative"
        >
          {/* App Header */}
          <header
            className={twMerge(
              "w-full h-16 transition-all duration-100 bg-white dark:bg-[#202947] shadow-md flex items-center justify-between px-4 fixed top-0 z-10",
              isSidebarOpen ? " lg:pl-60" : "pl-2 lg:pl-16"
            )}
          >
            <div className="w-full h-full flex justify-between items-center space-x-4 lg:px-4 py-1">
              {/* For Md */}
              <div className="flex items-center space-x-4 lg:hidden">
                <Drawer
                  direction="left"
                  open={isDrawerOpen}
                  onOpenChange={setDrawerOpen}
                >
                  <DrawerTrigger asChild>
                    <button>
                      <RiMenu2Fill className="size-7 animate-in" />
                    </button>
                  </DrawerTrigger>

                  <DrawerContent className="bg-[#202947] w-60 text-white border-none p-3">
                    <DrawerHeader className="text-left ">
                      <DrawerTitle className="text-2xl font-medium text-white">
                        Cloudlet
                      </DrawerTitle>
                    </DrawerHeader>
                    <div className=" transition-all duration-100 p-2 flex flex-col h-full z-20">
                      {user && user.photoURL && (
                        <div className="flex justify-start items-center">
                          <div className=" px-4 py-3 flex-1  rounded-lg mb-6 bg-white/10 ">
                            <div className="flex items-center justify-start gap-3 mb-4">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={user.photoURL} />
                                <AvatarFallback>
                                  {user.displayName}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h1 className="text-lg font-bold">
                                  {user.displayName}
                                </h1>
                                <h1 className="text-[0.7rem] font-bold">
                                  {user.email}
                                </h1>
                              </div>
                            </div>
                            <div className="flex w-full justify-end">
                              <Button
                                onClick={handleSignOut}
                                className="rounded-none bg-destructive/60"
                                size={"sm"}
                              >
                                Log Out
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                      <nav className="flex flex-col space-y-4">
                        {sidebarRoutes.map((route, index) => (
                          <SidebarLink
                            key={index}
                            isOpen
                            isActive={pathname.includes(route.to)}
                            {...route}
                          />
                        ))}
                      </nav>
                    </div>
                  </DrawerContent>
                </Drawer>
                <button onClick={() => navigate(-1)}>
                  <div>
                    <IoArrowBackSharp className="size-6 text-black/60" />
                  </div>
                </button>
              </div>
              {/* For Desktop */}
              <div className="hidden lg:flex items-center space-x-4">
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                  {isSidebarOpen ? (
                    <div>
                      <BiCollapseAlt
                        title="collapse"
                        className="text-xl text-black/60"
                      />
                    </div>
                  ) : (
                    <div>
                      <FaBars
                        title="expand"
                        className="text-xl text-black/60"
                      />
                    </div>
                  )}
                </button>

                <button onClick={() => navigate(-1)}>
                  <div>
                    <IoArrowBackSharp className="text-xl text-black/60" />
                  </div>
                </button>
              </div>

              <div className="flex items-center space-x-4">
                {/* <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <FaLanguage className="size-8 text-blue-500" />
                    </TooltipTrigger>
                    <TooltipContent className="text-center">
                      Change Language
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider> */}

                {/* <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Link to="/chat" className="text-2xl ">
                        <BiSolidMessageRoundedDots className="size-8 text-rose-500" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent className="text-center">
                      Message Now ! <br></br> Now you can message others from
                      here seamlessly
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider> */}
                {user && user.photoURL && (
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Avatar className="cursor-pointer">
                        <AvatarImage src={user.photoURL} alt="@shadcn" />
                        <AvatarFallback>{user.photoURL}</AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="mx-6">
                      <DropdownMenuLabel>
                        <div className="flex gap-3 items-center">
                          <Avatar className="cursor-pointer">
                            <AvatarImage src={user.photoURL} alt="@shadcn" />
                            <AvatarFallback>{user.displayName}</AvatarFallback>
                          </Avatar>
                          <div>
                            {" "}
                            <h1 className="text-lg">{user.displayName}</h1>
                            <h1 className="text-[0.7rem] font-bold">
                              {user.email}
                            </h1>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        {/* <DropdownMenuItem>Account Settings</DropdownMenuItem> */}
                        <DropdownMenuItem onClick={handleSignOut}>
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                {/* <Button variant={"ghost"} size={"icon"} className="text-2xl ">
                  <RiSettings2Line className="size-6 text-black/60" />
                </Button> */}
              </div>
            </div>
          </header>

          {/* Sidebar */}
          <aside
            className={` ${
              isSidebarOpen ? "w-60" : "w-16 "
            } bg-[#202947] text-white transition-all duration-100 lg:p-2 hidden lg:flex flex-col fixed top-0 left-0 h-full z-20`}
          >
            <div
              className={twMerge(
                "flex transition-all items-center gap-3 px-3 h-16"
              )}
            >
              {isSidebarOpen ? (
                <Fragment>
                  <div className={twMerge("text-lg font-bold")}>Cloudlet </div>

                  <Button
                    variant={"secondary"}
                    size={"sm"}
                    className="lg:hidden"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  >
                    {isSidebarOpen && <RiCloseLargeLine />}
                  </Button>
                </Fragment>
              ) : (
                <img
                  src={logo}
                  style={{ filter: "saturation(500%)" }}
                  alt="Cloudlet Logo"
                  className="h-6 bg-white  rounded-full"
                />
              )}
            </div>
            {user && user.photoURL && isSidebarOpen && (
              <div className="hidden md:block px-4 py-3 rounded-lg mb-6 bg-white/10 ">
                <div className="flex items-center justify-start gap-3 mb-4">
                  <Avatar>
                    <AvatarImage src={user.photoURL} />
                    <AvatarFallback>{user.displayName}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-sm font-bold">{user.displayName}</h1>
                    <h1 className="text-[0.7rem] font-bold">{user.email}</h1>
                  </div>
                </div>
                <div className="flex w-full justify-end">
                  {" "}
                  <Button
                    onClick={handleSignOut}
                    className="rounded-none bg-destructive/60"
                    size={"sm"}
                  >
                    Log Out
                  </Button>
                </div>
              </div>
            )}
            <nav className="flex flex-col space-y-4">
              {sidebarRoutes.map((route, index) => (
                <SidebarLink
                  key={index}
                  isOpen={isSidebarOpen}
                  isActive={pathname.includes(route.to)}
                  {...route}
                />
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main
            className={twMerge(
              "flex-1 p-2 md:p-4 overflow-y-scroll mt-16 transition-all duration-100",
              isSidebarOpen ? "lg:ms-60" : "lg:ms-16"
            )}
          >
            {user.emailVerified && user.photoURL ? (
              children
            ) : (
              <div className="bg-yellow-200 w-full flex-col flex justify-center items-center h-full p-8 ">
                <h1 className="text-center text-2xl font-bold ">
                  Complete Your Account
                </h1>
                <p className="text-center text-lg font-light ">
                  To continue you need to complete account creation process.{" "}
                </p>

                <Link to={"/account/create"}>
                  <Button className="my-4 mx-auto">
                    Complete Your Account!!
                  </Button>
                </Link>
              </div>
            )}
          </main>
        </div>
      )}
    </Fragment>
  );
}

function SidebarLink({
  to,
  Icon,
  text,
  isOpen,
  isActive,
  onClick,
}: {
  to: string;
  Icon: IconType;
  text: string;
  isOpen?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={twMerge(
        "flex items-center text-center space-x-3 text-sm hover:text-white transition-all duration-300 p-3 rounded-md ",
        isActive ? "text-white  bg-black/20" : "text-[#b2b8c7]",
        !isOpen && "justify-center flex"
      )}
    >
      {<Icon className=" select-none" />}
      {isOpen && <span className="select-none">{text}</span>}
    </Link>
  );
}

export default function DashboardLayout() {
  return (
    <Sidebar>
      <Outlet />
    </Sidebar>
  );
}
