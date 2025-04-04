import { motion } from "framer-motion";
import backgroundImage from "@/assets/bg.png";
import {
  FaBox,
  FaShoppingCart,
  FaChartLine,
  FaFileInvoice,
} from "react-icons/fa";
import { SignInForm } from "./LoginPage";
import ScrambleText from "@/components/myui/ScrambleText";
import { TbTransactionDollar } from "react-icons/tb";
import { RiSteering2Fill } from "react-icons/ri";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center bg-gray-200">
      {/* Hero Section with Fixed Background */}
      <motion.section
        initial={{ filter: "saturate(0)", backdropFilter: "blur(20px)" }}
        animate={{ filter: "saturate(2)", backdropFilter: "blur(0px)" }}
        transition={{ duration: 1, delay: 1 }}
        className="relative w-full h-[80vh] bg-cover bg-center hidden md:block"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundAttachment: "fixed",
          backgroundSize: "contain",
        }}
      >
        <motion.div
          initial={{ backdropFilter: "blur(20px)" }}
          animate={{ backdropFilter: "blur(3px)" }}
          transition={{ duration: 1, delay: 0.5 }}
          className="bg-black/60  w-full h-full absolute top-0 left-0  flex flex-col items-center justify-center text-center text-white"
        >
          <motion.h1
            initial={{ opacity: 0, letterSpacing: "0.5rem" }}
            whileInView={{ opacity: 1, letterSpacing: "0rem" }}
            transition={{ duration: 1 }}
            className="md:text-6xl lg:text-8xl font-bold text-yellow-400"
          >
            Cloudlet
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            transition={{
              duration: 0.5,
              delay: 0.5,
            }}
            className="text-xl lg:text-2xl mt-2 "
          >
            {
              "A cloud-based application for managing your outlet efficiently with our smart tools"
            }
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Features Cards */}
      <section className="relative -mt-12 max-w-6xl w-full px-4 hidden md:grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="p-3 lg:p-6 bg-white shadow-lg rounded-xl text-center flex flex-col items-center"
          >
            <feature.icon className="text-3xl lg:text-5xl text-blue-600 mb-4" />
            <div className="text-lg lg:text-xl font-semibold mb-2">
              <ScrambleText shuffleTime={40}>{feature.title}</ScrambleText>
            </div>
            <p className="text-xs lg:text-lg text-gray-600">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </section>

      {/* Sign-in Section  */}
      <section className="relative w-full  flex justify-center md:mt-12 z-10">
        <SignInForm />
      </section>

      {/* Footer */}
      <footer className="hidden md:block mt-16 py-4 text-center text-gray-500">
        &copy; {new Date().getFullYear()} Cloudlet | All rights reserved.
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Product Management",
    description: "Add and manage products effortlessly.",
    icon: FaBox,
  },
  {
    title: "Sales Tracking",
    description: "Keep records of every transaction and sale.",
    icon: FaShoppingCart,
  },
  {
    title: "Analytics & Reports",
    description: "Track sales, stock levels, and profits.",
    icon: FaChartLine,
  },
  {
    title: "Automated Invoice Generation",
    description: "Generate invoices automatically for every sale.",
    icon: FaFileInvoice,
  },
  {
    title: "Installment Records",
    description: "Manage customer installments and payments effortlessly.",
    icon: TbTransactionDollar,
  },
  {
    title: "Easy To Use",
    description: "User-friendly interface for all your needs.",
    icon: RiSteering2Fill,
  },
];
