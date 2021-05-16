import React, { useEffect, useState } from "react";
import { useSupabase, useUser } from "use-supabase";
import CanvasController from "./components/CanvasController";
import ModalWindow from "./components/ModalWindow";

const App = () => {
  const [popup, setPopup] = useState<boolean>(false);
  const supabase = useSupabase();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const topic = "it";
    const test = async () => {
      let { data, error } = await supabase
        .from("puzzles")
        .select("*")
        .filter("topic", "eq", topic);
      console.log(data);
    };
    test();
  }, []);

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
  }, [user]);

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
