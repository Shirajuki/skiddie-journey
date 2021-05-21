import { atom } from "recoil";

export const popupState = atom({
  key: "popupState",
  default: false,
});

export const topicState = atom({
  key: "topicState",
  default: "it",
});
