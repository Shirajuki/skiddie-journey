export interface IPuzzle {
  topic: string;
  id: string;
  title: string;
  description: string;
}
export interface IContent {
  topic: string;
  contents: IPuzzle[];
}
