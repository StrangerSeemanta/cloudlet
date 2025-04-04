import Loading from "@/components/myui/Loading";
import Stepper from "@/components/myui/Stepper";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/authContext";
import { useStep } from "@/context/useStep";

import { auth } from "@/firebase/firebase";
import {
  checkEmailExists,
  saveUserData,
  updateUserData,
} from "@/firebase/FirebaseUserData";
import { manageCompletedSteps } from "@/utils/manageCompletedStep";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { FormEvent, useContext, useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function CreateUserForm() {
  const navigate = useNavigate();
  const { user, loadingUser } = useContext(AuthContext);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isInvalid, setInvalid] = useState<boolean>(false);
  const [passwordConfirmed, setConfirmPassword] = useState<boolean>(false);
  const [isFinished, setFinished] = useState(false);
  const [formData, setSignInFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  useEffect(() => {
    if (user) {
      setFinished(true);
      navigate("verify_email");
    }
  }, [user, navigate]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInFormData({ ...formData, [name]: value });
  };
  const handleCreateAccountEmailPassword = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoading(true);

    try {
      if (!passwordConfirmed) throw new Error("Confirm Your Password");
      console.log("creating");
      const isEmailExist = await checkEmailExists(formData.email);
      if (isEmailExist) throw new Error("This Email Already Exist!!!");
      await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )
        .then(async (creds) => {
          const user = creds.user;
          console.log("user created");
          await saveUserData(user);

          await updateProfile(user, {
            displayName: formData.first_name + " " + formData.last_name,
          });
          await sendEmailVerification(user)
            .then(async () => {
              await saveUserData(user);
              await updateUserData(user.uid, "password", formData.password);

              setInvalid(false);
              setLoading(false);
              navigate("verify_email");
              setFinished(true);
            })
            .catch((error) => {
              toast(
                "Failed to Send Verification Email! Check Your Email Address",
                {
                  position: "top-left",
                  description: String(error).split(":")[2],
                  descriptionClassName: "bg-white p-3 rounded-sm mt-4",
                  style: {
                    backgroundColor: "red",
                    color: "white",
                    fontSize: 15,
                  },
                }
              );
            });
        })
        .catch((err) => {
          setLoading(false);
          console.error(err);
          setInvalid(true);
          toast("Failed to Create Account! Try Again", {
            position: "top-left",
            description: String(err).split(":")[2],
            descriptionClassName: "bg-white p-3 rounded-sm mt-4",
            style: {
              backgroundColor: "red",
              color: "white",
              fontSize: 15,
            },
          });
        });
    } catch (error) {
      setInvalid(true);
      setLoading(false);

      toast(String(error), {
        position: "top-left",
        style: { backgroundColor: "red", color: "white" },
      });
    }
  };

  const google_provider = new GoogleAuthProvider();
  const handleGoogleSignIn = async () => {
    try {
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
    } catch (error) {
      toast("Failed To Continue With Google", {
        description: String(error),
      });
    }
  };
  return (
    <Fragment>
      {loadingUser ? (
        <Loading />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <h2 className="text-lg md:text-2xl font-semibold md:text-center mb-4">
            Create New Account
          </h2>
          <button
            disabled={isFinished}
            onClick={handleGoogleSignIn}
            className=" flex items-center justify-center w-full disabled:pointer-events-none disabled:opacity-25 border border-gray-300 p-2 rounded-lg hover:bg-gray-100"
          >
            <FcGoogle className="text-2xl mr-2" /> Continue with Google
          </button>

          <div className="mt-4 flex justify-center items-center">
            <hr className="w-full border-gray-300" />
            <span className="px-2 text-gray-500">OR</span>
            <hr className="w-full border-gray-300" />
          </div>
          <form
            className="space-y-4 mt-4"
            onSubmit={handleCreateAccountEmailPassword}
          >
            <div className="grid grid-cols-2 items-center space-x-4">
              <div className={twMerge(isFinished && "opacity-30")}>
                <label htmlFor="first_name" className="block text-gray-700">
                  First Name
                </label>
                <input
                  required
                  autoComplete="on"
                  type="text"
                  className="w-full  p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  name="first_name"
                  id="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  disabled={isFinished}
                />
              </div>
              <div className={twMerge(isFinished && "opacity-30")}>
                <label htmlFor="last_name" className="block text-gray-700">
                  Last Name
                </label>
                <input
                  autoComplete="on"
                  type="text"
                  name="last_name"
                  id="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your last name"
                  disabled={isFinished}
                />
              </div>
            </div>
            <div className={twMerge(isFinished && "opacity-30")}>
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <input
                autoComplete="on"
                required
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                name="email"
                id="email"
                disabled={isFinished}
              />
            </div>
            <div className="grid grid-cols-2  item-center space-x-4">
              <div className={twMerge(isFinished && "opacity-30")}>
                <label htmlFor="password" className="block text-gray-700">
                  New Password
                </label>
                <input
                  required
                  autoComplete="on"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your new password"
                  name="password"
                  id="password"
                  disabled={isFinished}
                />
              </div>
              <div className={twMerge(isFinished && "opacity-30")}>
                <label
                  htmlFor="confirm_password"
                  className="block text-gray-700"
                >
                  Confirm Your Password
                </label>
                <input
                  autoComplete="on"
                  required
                  type="password"
                  onChange={(e) => {
                    setConfirmPassword(formData.password === e.target.value);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm your  password"
                  disabled={isFinished}
                  name="confirm_password"
                  id="confirm_password"
                />
              </div>
            </div>

            <h3
              className={twMerge(
                "text-sm text-destructive italic",
                isInvalid ? "block" : "hidden"
              )}
            >
              Account Creation Failed. Check your informations and internet
              connection. Try Again !!
            </h3>
            <Button
              disabled={isFinished}
              className="w-full text-lg  font-medium bg-blue-600 disabled:bg-gray-400/70 text-white p-2 rounded-lg hover:bg-blue-700"
            >
              Create Account
              {isLoading && <Loader2 className="animate-spin" />}
            </Button>
            {/* <p className="text-sm text-center text-gray-500 mt-2 hover:underline cursor-pointer">Forgot Password?</p> */}
          </form>

          <p className="text-md text-center  font-bold text-gray-600 mt-4 p-2 border-1 border-gray-300 rounded-lg">
            Already have an account?{" "}
            <Link
              to={"/account/login"}
              className="text-blue-600 hover:underline"
            >
              Log In Now!
            </Link>
          </p>
        </motion.div>
      )}
    </Fragment>
  );
}
function CreateAccountPage() {
  const { user } = useContext(AuthContext);
  const { markComplete, unmarkComplete } = useStep();
  useEffect(() => {
    manageCompletedSteps(user, markComplete, unmarkComplete);
  }, [user, markComplete, unmarkComplete]);
  return (
    <Fragment>
      <section className="relative h-screen w-full md:rounded-lg   md:flex justify-center md:py-6 z-10">
        <h1 className="block md:hidden text-xl p-5  bg-white font-bold text-blue-600 border-b-2 border-dotted border-black/30">
          Cloudlet
        </h1>

        <Stepper />

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 10,
            duration: 0.5,
          }}
          className="bg-white p-8  h-full w-full md:max-w-xl"
        >
          <Outlet />
        </motion.div>
      </section>
    </Fragment>
  );
}

export default CreateAccountPage;
