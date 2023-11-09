import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  const existingProfile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (existingProfile) {
    return existingProfile;
  }

  try {
    const newProfile = await db.profile.create({
      data: {
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return newProfile;
  } catch (error) {
    // Handle any potential errors
    console.error("Error creating profile:", error);
    throw error;
  }
};
