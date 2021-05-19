export interface IPuzzle {
  topic: string;
  id: string;
  title: string;
  tag: string;
  points: number;
  description: string;
  completed: boolean;
}
export interface IContent {
  topic: string;
  contents: IPuzzle[];
}
