import { Fragment } from "react/jsx-runtime";
//import { RiAddCircleFill } from "react-icons/ri";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { AuthContext } from "@/context/authContext";
import { toast } from "sonner";
import {
  getProfilePicURL,
  uploadProfilePic,
} from "@/supabase/manageProfilepicSupabase";
import { updateProfile } from "firebase/auth";
import { RiVerifiedBadgeLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { updateUserData } from "@/firebase/FirebaseUserData";
export default function UploadProfilePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { user, loadingUser } = useContext(AuthContext);
  const [isFinished, setFinished] = useState(false);
  useEffect(() => {
    if (user && user.photoURL) {
      setFinished(true);
    }
  }, [user]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setSelectedFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };
  const handleUploadProfilePicture = async () => {
    if (!user) return toast.error("Log In First");
    if (!selectedFile) {
      toast("Please select a file to upload.");
      return;
    }

    try {
      setUploading(true);

      // Upload the file to Supabase Storage

      const fileName = `${String(Date.now())}-profilepic-${selectedFile.name}`;
      const path = user.uid + "/" + fileName;
      await uploadProfilePic(selectedFile, path);

      // Get the public URL of the uploaded file
      const publicUrlData = await getProfilePicURL(path);
      if (!publicUrlData) return toast("Failed To Upload Try Again");

      await updateProfile(user, {
        photoURL: publicUrlData.publicUrl,
      });
      await updateUserData(user.uid, "photoURL", publicUrlData.publicUrl);

      toast("Profile Picture Uploaded successfully");
      // Save the public URL to the user's profile in your database
      // Example: updateUserData(user.uid, "photoURL", publicUrlData.publicUrl);
      setFinished(true);
      navigate(0);
      setSelectedFile(null); // Clear the selected file
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error("An error occurred while uploading the profile picture.");
    } finally {
      setUploading(false);
    }
  };
  return (
    <Fragment>
      {loadingUser ? (
        <Loading />
      ) : isFinished ? (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center text-center"
        >
          <RiVerifiedBadgeLine className="size-25 mb-3 text-green-600" />

          <h2 className="text-3xl font-bold text-green-600">
            Profile Picture Uploaded
          </h2>
          <p>
            Your new profile picture uploaded successfully. You can change
            profile picture later. For now finish your account creation please.
          </p>
          <Link to={"/"}>
            <button className="mt-4 p-2 px-6 bg-green-600 text-white rounded-lg">
              Finish
            </button>
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <h2 className="text-lg md:text-2xl font-semibold md:text-left mb-3">
            Upload Profile Picture
          </h2>
          <div className="flex flex-col items-center gap-4">
            {/* Hidden File Input */}
            <input
              type="file"
              id="fileInput"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />

            {/* File Upload Box */}
            <motion.label
              htmlFor="fileInput"
              className={twMerge(
                "flex flex-col items-center justify-center w-full  border-2 border-dashed rounded-lg cursor-pointer transition-all",
                selectedFile ? "p-2" : " p-6"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {selectedFile ? (
                <div className="relative max-w-[200px] max-h-[200px]">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-10 h-10 text-gray-400" />
                  <p className="text-gray-600">Click to upload</p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG, JPEG (Max 20 MB)
                  </p>
                </>
              )}
            </motion.label>
          </div>
          {selectedFile && (
            <div>
              <h2 className="text-md md:text-xl mt-5 font-semibold md:text-left mb-3">
                Preview
              </h2>
              <div className="flex gap-4 items-center p-3 border-2 rounded-lg bg-gray-200">
                <Avatar className="w-20 h-20 shadow-xl">
                  <AvatarImage src={URL.createObjectURL(selectedFile)} />
                  <AvatarFallback>PP</AvatarFallback>
                </Avatar>
                <Avatar className="w-15 h-15 shadow-xl">
                  <AvatarImage src={URL.createObjectURL(selectedFile)} />
                  <AvatarFallback>PP</AvatarFallback>
                </Avatar>
                <Avatar className="shadow-xl">
                  <AvatarImage src={URL.createObjectURL(selectedFile)} />
                  <AvatarFallback>PP</AvatarFallback>
                </Avatar>
              </div>
            </div>
          )}
          <div className="flex justify-center items-center mt-4 w-full">
            <Button
              onClick={handleUploadProfilePicture}
              className="w-full py-6 text-lg"
            >
              {uploading ? "uploading" : "Upload Picture"}
            </Button>
          </div>
        </motion.div>
      )}
    </Fragment>
  );
}
