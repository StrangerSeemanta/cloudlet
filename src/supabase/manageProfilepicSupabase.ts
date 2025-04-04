import { toast } from "sonner";
import { supabase } from "./supabase";

export const uploadProfilePic = async (file: File, path: string) => {
  try {
    const { error: uploadError } = await supabase.storage
      .from("profilepic") // Replace with your Supabase bucket name
      .upload(path, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    toast("Failed to upload profile picture.", {
      description: String(error),
    });
  }
};
export async function getProfilePicURL(path: string) {
  try {
    const { data: publicUrlData } = supabase.storage
      .from("profilepic")
      .getPublicUrl(path);

    if (!publicUrlData?.publicUrl) {
      throw new Error("Error getting public URL");
    }
    return publicUrlData;
  } catch (error) {
    toast("Failed to upload profile picture. Try Again", {
      description: String(error),
    });
    return null;
  }
}
