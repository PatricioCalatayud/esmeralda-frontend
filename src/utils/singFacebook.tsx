import { signIn, signOut, getSession } from "next-auth/react";

const signInWithFacebook = async() => {
    await signIn("facebook",{ redirectTo: "/" })
  };

const signOutWithFacebook = async() => {
    await signOut()
  };

  const getSessionFacebook= async () => {
    const session = await getSession();
    console.log(session);
    return session;
  };
  
  export { signInWithFacebook, signOutWithFacebook, getSessionFacebook };