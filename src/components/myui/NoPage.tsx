import Lottie from "lottie-react";
import { Fragment } from "react/jsx-runtime";
import PageNotFound_Anime from "@/assets/pageNotFound.json";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { useContext } from "react";
import { AuthContext } from "@/context/authContext";
function NoPage() {
  const navigate = useNavigate();
  const { loadingUser } = useContext(AuthContext);
  return (
    <Fragment>
      <div className="h-screen w-full">
        {loadingUser ? (
          <Loading />
        ) : (
          <div className="w-full h-full flex flex-col space-y-3 justify-center items-center">
            <Lottie
              className="w-[50%] h-[50%]"
              animationData={PageNotFound_Anime}
            />
            <h1 className="text-2xl md:text-4xl font-bold font-mono">
              Page Not Found
            </h1>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </div>
        )}
      </div>
    </Fragment>
  );
}

export default NoPage;
