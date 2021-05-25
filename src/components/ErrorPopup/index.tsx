import React, { useState, useRef, useEffect } from "react";
import { IContent, IPuzzle, ICompleted, IPuzzleResponse } from "../../types";
import { useRecoilState, useRecoilValue } from "recoil";
import { popupState, topicState } from "../../recoil/atoms";
import "./index.css";
type ErrorPopupType = {
  error: any;
};
const ErrorPopup: React.FC<ErrorPopupType> = (error) => {
  // useEffect on mount or topic is changed
  useEffect(() => {
    console.log();
  }, []);

  return (
    <div className="errorPopup">
      <div className="modal">
        <p>{error?.message ? error?.message : "404 ERROR"}</p>
      </div>
    </div>
  );
};

export default ErrorPopup;
