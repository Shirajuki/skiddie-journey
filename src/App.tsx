import React, { useEffect, useState } from "react";
import { useSupabase } from "use-supabase";
import CanvasController from "./components/CanvasController";
import ModalWindow from "./components/ModalWindow";

const App = () => {
  const [popup, setPopup] = useState<boolean>(false);
  const supabase = useSupabase();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      // Get user from session
      const session = supabase.auth.session();
      setUser(session?.user ?? null);

      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          const currentUser = session?.user;
          setUser(currentUser);
        }
      );
      return () => {
        authListener?.unsubscribe();
      };
    }
    // If no user found in session, log in
    if (!user) {
      const login = async () => {
        const { user: lUser } = await supabase.auth.signIn({
          email: "test@email.com",
          password: "example-password",
        });
        setUser(lUser);
      };
      login();
    }
  }, [user, supabase.auth]);

  return (
    <div className="App">
      {user ? (
        <>
          <ModalWindow popup={popup} setPopup={setPopup} />
          <CanvasController setPopup={setPopup} />
        </>
      ) : (
        <h1>Add login with OAuth here :)</h1>
      )}
    </div>
  );
};

export default App;
