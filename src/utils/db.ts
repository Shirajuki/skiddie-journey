import { supabase } from "../lib/api";

export const getPuzzlesByTopic = async (topic: string) => {
  let { data, error } = await supabase
    .from("puzzles")
    .select("id, topic, title, tag, points, description")
    .filter("topic", "eq", topic);
  return { data: data, error: error };
};

export const getPuzzles = async () => {
  let { data, error } = await supabase
    .from("puzzles")
    .select("id, topic, title, tag, points, description");
  return { data: data, error: error };
};

export const getCompletedPuzzles = async () => {
  let { data, error } = await supabase
    .from("completed_puzzles")
    .select("puzzle_id");
  return { data: data, error: error };
};

export const checkPuzzleComplete = async (puzzle_id: string, user: any) => {
  let { data, error } = await supabase
    .from("completed_puzzles")
    .select("user_id")
    .filter("user_id", "eq", user?.id)
    .filter("puzzle_id", "eq", puzzle_id)
    .single();
  // else console.log(data, !!data?.id, error);
  // return !!data?.id;
  return { data: !!data?.id, error: error };
};

// Inserts answer if flag given is correct, works serverless thanks to PostgreSQL trigger
export const addPuzzleComplete = async (
  puzzle_id: string,
  answer: string,
  user: any
) => {
  if (answer.length > 0) {
    let { data, error } = await supabase
      .from("completed_puzzles")
      .insert({ user_id: user?.id, puzzle_id: puzzle_id, flag: answer })
      .single();
    // if (error) console.log(error);
    return { data: !!data, error: error };
  }
  return { data: false, error: null };
};
