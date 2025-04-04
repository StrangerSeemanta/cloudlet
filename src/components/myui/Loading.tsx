import { Fragment } from "react";
import Lottie from "lottie-react";
import loadingAnimationData from "@/assets/loadingAnime..json";

export default function Loading() {
  return (
    <Fragment>
      <div className="w-full h-full flex justify-center items-center overflow-hidden">
        <div className="w-full h-full flex justify-center items-center">
          <Lottie
            animationData={loadingAnimationData}
            className="w-[50%] h-[50%] max-w-full max-h-full"
          />
        </div>
      </div>
    </Fragment>
  );
}
