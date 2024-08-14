import { signIn, signOut, getSession } from "next-auth/react";

const signInWithGoogle = async() => {
    await signIn("google",{ redirectTo: "/" })
  };

const signOutWithGoogle = async() => {
    await signOut()
  };

  const getSessionGoogle = async () => {
    const session = await getSession();
    console.log(session);
    return session;
  };
  
  export { signInWithGoogle, signOutWithGoogle, getSessionGoogle };