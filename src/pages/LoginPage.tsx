import { motion } from "framer-motion";
import { auth } from "@/firebase/firebase";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { FormEvent, useContext, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import { AuthContext } from "@/context/authContext";
import Loading from "@/components/myui/Loading";
import { saveUserData } from "@/firebase/FirebaseUserData";
export function SignInForm() {
  const { user, loadingUser } = useContext(AuthContext);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isInvalid, setInvalid] = useState<boolean>(false);

  const [signInFormData, setSignInFormData] = useState({
    sign_in_email: "",
    sign_in_password: "",
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInFormData({ ...signInFormData, [name]: value });
  };
  const google_provider = new GoogleAuthProvider();
  const handleGoogleSignIn = async () => {
    await signInWithPopup(auth, google_provider)
      .then(async (res) => {
        await saveUserData(res.user);
        toast("You're Logged In !", {
          position: "top-left",
        });
      })
      .catch((er) => {
        console.error(er);
      });
  };
  const handleEmailPasswordSignIn = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setLoading(true);

    await signInWithEmailAndPassword(
      auth,
      signInFormData.sign_in_email,
      signInFormData.sign_in_password
    )
      .then((creds) => {
        setLoading(false);
        console.log(creds.user);
        toast("logged In");
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
        setInvalid(true);
        toast("Failed to log in! Email and Password did not match", {
          position: "top-left",

          style: { backgroundColor: "red", color: "white" },
        });
      });
  };
  return (
    <Fragment>
      {loadingUser ? (
        <Loading />
      ) : user ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-green-200 p-8 md:rounded-lg shadow-xl w-full max-w-md"
        >
          <h2 className="text-lg md:text-2xl font-semibold md:text-center mb-4">
            You Are Already Signed In
          </h2>
          <p>
            If you want to log in with a new account, you need to log out first
            💝
          </p>
          <h4 className="text-sm italic text-red-700">
            To logout, click on your profile picture in dashboard section or
            check the sidebar
          </h4>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 md:rounded-lg shadow-xl w-full max-w-md"
        >
          <h1 className="block md:hidden text-xl mb-8 font-bold text-blue-600 border-b-2 border-dotted border-black/30">
            Cloudlet
          </h1>
          <h2 className="text-lg md:text-2xl font-semibold md:text-center mb-4">
            Sign In
          </h2>
          <form
            method="POST"
            onSubmit={handleEmailPasswordSignIn}
            className="space-y-4"
          >
            <div>
              <label htmlFor="sign_in_email" className="block text-gray-700">
                Email
              </label>
              <input
                required
                type="email"
                name="sign_in_email"
                id="sign_in_email"
                value={signInFormData.sign_in_email}
                onChange={handleInputChange}
                className={twMerge(
                  "w-full p-2 border  rounded-lg focus:ring-2 focus:ring-blue-500",
                  isInvalid ? "border-destructive" : "border-gray-300"
                )}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="sign_in_password" className="block text-gray-700">
                Password
              </label>
              <input
                required
                type="password"
                name="sign_in_password"
                id="sign_in_password"
                value={signInFormData.sign_in_password}
                onChange={handleInputChange}
                className={twMerge(
                  "w-full p-2 border  rounded-lg focus:ring-2 focus:ring-blue-500",
                  isInvalid ? "border-destructive" : "border-gray-300"
                )}
                placeholder="Enter your password"
              />
            </div>
            <h3
              className={twMerge(
                "text-sm text-destructive italic",
                isInvalid ? "block" : "hidden"
              )}
            >
              Log In Failed. Check your email and password then try again !!
            </h3>
            <Button
              size={"lg"}
              type="submit"
              className="w-full bg-blue-600 text-white p-2 text-md rounded-lg hover:bg-blue-700"
            >
              {isLoading && <Loader2 className="animate-spin" />}
              Sign In
            </Button>
            {/* <p className="text-sm text-center text-gray-500 mt-2 hover:underline cursor-pointer">Forgot Password?</p> */}
          </form>
          <div className="mt-4 flex justify-center items-center">
            <hr className="w-full border-gray-300" />
            <span className="px-2 text-gray-500">OR</span>
            <hr className="w-full border-gray-300" />
          </div>
          <button
            onClick={handleGoogleSignIn}
            className="mt-4 flex items-center justify-center w-full border border-gray-300 p-2 rounded-lg hover:bg-gray-100"
          >
            <FcGoogle className="text-2xl mr-2" /> Sign in with Google
          </button>
          <p className="text-md text-center  font-bold text-gray-600 mt-4 p-2 border-1 border-gray-300 rounded-lg">
            Don't have an account?{" "}
            <Link
              to="/account/create"
              className="text-blue-600 hover:underline"
            >
              Create New Account
            </Link>
          </p>
        </motion.div>
      )}
    </Fragment>
  );
}
function LoginPage() {
  return (
    <Fragment>
      <section className="relative w-full  flex justify-center md:mt-12 z-10">
        <SignInForm />
      </section>
    </Fragment>
  );
}

export default LoginPage;
