import React, { useState, useRef, useEffect } from "react";
import { useSupabase, useUser } from "use-supabase";
import { IContent, IPuzzle } from "../../types";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import "./index.css";

const content: IContent = {
  topic: "it",
  contents: [
    {
      topic: "it",
      id: "1",
      title: "Binary",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, a nostrum. Dolorem, repellat quidem ut, minima sint vel eveniet quibusdam voluptates delectus doloremque, explicabo tempore dicta adipisci fugit amet dignissimos?",
    },
    {
      topic: "it",
      id: "2",
      title: "Hexadecimal",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, a nostrum. Dolorem, repellat quidem ut, minima sint vel eveniet quibusdam voluptates delectus doloremque, explicabo tempore dicta adipisci fugit amet dignissimos?",
    },
  ],
};
const topic = "it";
type modalType = {
  popup: boolean;
  setPopup: (popup: boolean) => void;
};
const ModalWindow: React.FC<modalType> = ({ popup, setPopup }) => {
  const [puzzle, setPuzzle] = useState<IPuzzle>();
  const [error, setError] = useState<string>();
  const [input, setInput] = useState<string>();
  const [completed, setCompleted] = useState<boolean>(false);
  const inputRef = useRef(null);
  const supabase = useSupabase();
  const user = useUser();

  const checkTodoComplete = async () => {
    let { data: todos, error } = await supabase
      .from("todos")
      .select("id")
      .filter("user_id", "eq", user.id)
      .single();
    setCompleted(!!todos?.id);
    console.log(todos, !!todos?.id);
  };

  useEffect(() => {
    checkTodoComplete();
  }, []);

  const addTodo = async () => {
    const answer: string = input.trim();
    if (answer.length > 0 && !completed) {
      let { data: todo, error } = await supabase
        .from("todos")
        .insert({ user_id: user.id, puzzle: 1 })
        .single();
      if (error) setError(error.message);
      else {
        console.log(todo);
        setError(null);
        inputRef.current.value = "";
      }
    }
  };
  const inputHandler = (event: any) => {
    setInput(event.target.value);
  };

  return (
    <Popup
      open={popup}
      modal
      nested
      onClose={() => {
        setPopup(false);
      }}
    >
      {(close: any) => {
        return (
          <div className="modal">
            <button className="close" onClick={close}>
              &times;
            </button>
            <div className="header">{content.topic}</div>
            <div className="content">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, a
              nostrum. Dolorem, repellat quidem ut, minima sint vel eveniet
              quibusdam voluptates delectus doloremque, explicabo tempore dicta
              adipisci fugit amet dignissimos?
            </div>
            <div className="actions">
              {completed ? (
                <p>COMPLETED</p>
              ) : (
                <>
                  <input type="text" ref={inputRef} onChange={inputHandler} />
                  <button
                    className="button"
                    onClick={() => {
                      addTodo();
                    }}
                  >
                    submit
                  </button>
                </>
              )}
            </div>
          </div>
        );
      }}
    </Popup>
  );
};

export default ModalWindow;
