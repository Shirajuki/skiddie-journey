import React, { useState, useRef, useEffect } from "react";
import { IContent, IPuzzle, ICompleted, IPuzzleResponse } from "../../types";
import { useRecoilState, useRecoilValue } from "recoil";
import { popupState, topicState } from "../../recoil/atoms";
import "./index.css";
interface IErrorPopup {
  error: string;
  setError: (error: string) => void;
}
type ErrorPopupType = {
  error: string;
  setError: (error: string) => void;
};
const ErrorPopup: React.FC<ErrorPopupType> = ({
  error,
  setError,
}: IErrorPopup) => {
  const errorRef = useRef(error);
  errorRef.current = error;
  // useEffect on mount or error is changed
  useEffect(() => {
    const timer = setTimeout(() => {
      if (errorRef.current != null) setError(null);
      console.log("error finished");
    }, 4500);
    return () => clearTimeout(timer);
  }, [errorRef.current]);

  return (
    <>
      {error ? (
        <div className="errorPopup">
          <div className="modal">
            {/* Design better here */}
            <p>{error !== "" ? error : "404 ERROR"}</p>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default ErrorPopup;
