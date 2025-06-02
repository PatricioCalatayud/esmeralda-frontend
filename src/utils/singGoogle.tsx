import { signIn, signOut, getSession } from "next-auth/react";

const signInWithGoogle = async() => {
  try {
    const result = await signIn("google", { 
      redirect: false
    });
    return result;
  } catch (error) {
    console.error("Error en signInWithGoogle:", error);
    return null;
  }
};

const signOutWithGoogle = async() => {
  try {
    await signOut({ redirect: false });
  } catch (error) {
    console.error("Error en signOutWithGoogle:", error);
  }
};

const getSessionGoogle = async () => {
  try {
    const session = await getSession();
    return session;
  } catch (error) {
    console.error("Error en getSessionGoogle:", error);
    return null;
  }
};

export { signInWithGoogle, signOutWithGoogle, getSessionGoogle };