import { AuthContext } from "@/context/authContext";
import { sendEmailVerification } from "firebase/auth";
import { Fragment, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "./Loading";
import Lottie from "lottie-react";
import emailAnime from "@/assets/email_anime.json";
import { RiVerifiedBadgeLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { manageCompletedSteps } from "@/utils/manageCompletedStep";
import { useStep } from "@/context/useStep";
import { updateUserData } from "@/firebase/FirebaseUserData";
function VerifyEmail() {
  const { user, loadingUser } = useContext(AuthContext);
  const [isVerified, setVerified] = useState<boolean>(
    !!(user && user.emailVerified)
  );
  const { markComplete, unmarkComplete } = useStep();
  useEffect(() => {
    if (!user) return;
    if (user.emailVerified) setVerified(true);
    const checkVerification = setInterval(async () => {
      await user.reload(); // 🔹 Force refresh user data
      if (user.emailVerified) {
        setVerified(true);
        updateUserData(user.uid, "emailVerified", true);
        manageCompletedSteps(user, markComplete, unmarkComplete);
        clearInterval(checkVerification);
      }
      console.log("Checking verification...");
    }, 3000); // 🔹 Check every 3 seconds

    return () => clearInterval(checkVerification);
  }, [user, markComplete, unmarkComplete]); // ✅ Only depends on `user`

  const resendVerificationEmail = async () => {
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
      toast("Verification email sent !");
    }
  };

  return (
    <Fragment>
      {loadingUser ? (
        <Loading />
      ) : isVerified ? (
        <div className="flex flex-col items-center text-center">
          <RiVerifiedBadgeLine className="size-25 mb-3 text-green-600" />

          <h2 className="text-3xl font-bold text-green-600">Email Verified</h2>
          <p>
            Thanks for your co-operation. You are now a verified user. Continue
            your account creation
          </p>
          <Link to={"/account/create/upload_pp"}>
            <button className="mt-4 p-2 px-6 bg-green-600 text-white rounded-lg">
              Next
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center">
          <Lottie className="w-[40%] h-[40%]" animationData={emailAnime} />

          <h2 className="text-3xl font-bold text-blue-600">
            Verify Your Email Address
          </h2>
          <p>
            We have sent a verification email to {user?.email}. Please check
            your inbox.
          </p>
          <h2 className="text-lg text-red-500 font-semibold ">
            Click On The Activation Link In Your Email To Verify .
          </h2>
          <button
            onClick={resendVerificationEmail}
            className="mt-4 p-2 bg-blue-600 text-white rounded-lg"
          >
            Resend Email
          </button>
        </div>
      )}
    </Fragment>
  );
}

export default VerifyEmail;
