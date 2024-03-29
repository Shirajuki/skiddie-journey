export interface IPuzzle {
  topic: string;
  id: string;
  title: string;
  tag: string;
  points: number;
  description: string;
  completed?: boolean;
}
export interface IContent {
  topic: string;
  contents: IPuzzle[];
}
export interface ICompleted {
  puzzle_id: string;
}
export interface IPuzzleResponse {
  data: IPuzzle[] | ICompleted[];
  error: any;
}
export interface IContentResponse {
  data: IContent[];
  error: any;
}
export interface IBooleanResponse {
  data: boolean;
  error: any;
}
