import { supabase } from "../lib/api";

export const getPuzzlesByTopic = async (topic: string) => {
  let { data, error } = await supabase
    .from("puzzles")
    .select("id, topic, title, tag, points, description")
    .filter("topic", "eq", topic);
  if (error) console.log(error);
  return data;
};

export const getPuzzles = async () => {
  let { data, error } = await supabase
    .from("puzzles")
    .select("id, topic, title, tag, points, description");
  if (error) console.log(error);
  return data;
};

export const getCompleted = async () => {
  let { data, error } = await supabase
    .from("todos")
    .select("id, topic, title, tag, points, description");
  if (error) console.log(error);
  return data;
};

export const checkComplete = async (puzzle_id: string, user: any) => {
  let { data, error } = await supabase
    .from("todos")
    .select("id")
    .filter("user_id", "eq", user?.id)
    .filter("puzzle_id", "eq", puzzle_id)
    .single();
  if (error) console.log(error);
  else console.log(data, !!data?.id);
  return !!data?.id;
};

// Inserts answer if flag given is correct, works serverless thanks to PostgreSQL trigger
export const addTodo = async (puzzle_id: string, answer: string, user: any) => {
  if (answer.length > 0) {
    let { data, error } = await supabase
      .from("todos")
      .insert({ user_id: user?.id, puzzle_id: puzzle_id, flag: answer })
      .single();
    if (error) console.log(error.message);
    return { data: !!data, error: error?.message };
  }
  return { data: false, error: null };
};
