import React, { useState, useRef, useEffect } from "react";
import { useUser } from "use-supabase";
import { IContent, IPuzzle, ICompleted, IPuzzleResponse } from "../../types";
import {
  getPuzzlesByTopic,
  getCompletedPuzzles,
  addPuzzleComplete,
} from "../../utils/db";
import Popup from "reactjs-popup";
import { useRecoilState, useRecoilValue } from "recoil";
import { popupState, topicState } from "../../recoil/atoms";
import ErrorPopup from "../ErrorPopup";
import "reactjs-popup/dist/index.css";
import "./index.css";

const ModalWindow: React.FC = () => {
  const [popup, setPopup] = useRecoilState(popupState);
  const topic = useRecoilValue(topicState);
  const [content, setContent] = useState<IContent>();
  const [puzzle, setPuzzle] = useState<IPuzzle>();
  const [error, setError] = useState<string>();
  const [input, setInput] = useState<string>();
  const inputRef = useRef(null);
  const user = useUser();

  const isCompleted = () => {
    if (puzzle) return puzzle.completed;
    return false;
  };

  const isActive = (id: string) => {
    if (puzzle) return puzzle.id === id;
    return false;
  };
  // useEffect on mount or topic is changed
  useEffect(() => {
    // Get all puzzles by given topic
    getPuzzlesByTopic(topic).then(({ data, error }: IPuzzleResponse) => {
      const content: IContent = {
        topic: topic,
        contents: data as IPuzzle[],
      };
      setContent(content);
      setPuzzle(content?.contents[0]);

      // Check and update completion on content puzzles
      getCompletedPuzzles().then((res: IPuzzleResponse) => {
        const data = res.data as ICompleted[];
        const error2 = res.error;
        if (error || error2) {
          setError("ERROR ON FETCH OF TOPIC/PUZZLES");
        } else setError(null);
        const completedPuzzles = data.map((item: ICompleted) => item.puzzle_id);
        console.log(completedPuzzles, content);
        content?.contents?.forEach((data) => {
          data.completed = completedPuzzles.includes(data.id);
        });
        setPuzzle(content?.contents[0]); // Update puzzle once again
      });
    });
  }, [topic]);

  const add = () => {
    const answer: string = input.trim();
    addPuzzleComplete(puzzle.id, answer, user).then(({ data, error }) => {
      if (data) {
        puzzle.completed = true;
        console.log("PLAY PUZZLE COMPLETE INSTANCE");
      }
      if (error && error.message !== "") {
        setError(error.message);
        console.log("PLAY ERROR INSTANCE");
      } else setError(null);
      inputRef.current.value = "";
    });
  };
  const inputHandler = (event: any) => {
    setInput(event.target.value);
  };

  return (
    <>
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
            <>
              <div className="sidemenu">
                <div>
                  {content ? (
                    <>
                      {content.contents.map((contentPuzzle, index) => {
                        return (
                          <button
                            key={index}
                            className={
                              isActive(contentPuzzle.id) ? "active" : ""
                            }
                            onClick={() => setPuzzle(contentPuzzle)}
                          >
                            {contentPuzzle.title}
                            {contentPuzzle.completed ? (
                              <svg
                                width="9"
                                height="7"
                                viewBox="0 0 9 7"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M6.88471 0.206803C7.02558 0.0726919 7.21303 -0.00145012 7.40753 2.14954e-05C7.60202 0.00149312 7.78833 0.0784635 7.92716 0.214691C8.06598 0.350918 8.14645 0.535747 8.15159 0.730177C8.15673 0.924607 8.08614 1.11343 7.95471 1.2568L3.96471 6.2468C3.8961 6.3207 3.81329 6.38001 3.72124 6.42117C3.62919 6.46233 3.52978 6.48451 3.42896 6.48638C3.32814 6.48825 3.22798 6.46976 3.13447 6.43204C3.04095 6.39431 2.95601 6.33811 2.88471 6.2668L0.238708 3.6208C0.165022 3.55214 0.105919 3.46934 0.0649275 3.37734C0.0239355 3.28534 0.0018935 3.18603 0.00011672 3.08533C-0.00166006 2.98462 0.0168648 2.88459 0.0545858 2.79121C0.0923068 2.69782 0.148451 2.61298 0.21967 2.54176C0.290889 2.47055 0.375723 2.4144 0.469111 2.37668C0.562499 2.33896 0.662528 2.32043 0.763231 2.32221C0.863934 2.32399 0.963247 2.34603 1.05525 2.38702C1.14725 2.42801 1.23005 2.48712 1.29871 2.5608L3.39271 4.6538L6.86571 0.228803C6.87196 0.221104 6.87864 0.213759 6.88571 0.206803H6.88471Z"
                                  fill="#A8CED0"
                                />
                              </svg>
                            ) : (
                              <></>
                            )}
                          </button>
                        );
                      })}
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className="modalWrapper">
                <div className="modal">
                  <button className="close" onClick={close}>
                    &times;
                  </button>
                  <div className="header">
                    <h2>{content ? content.topic : "IT"}</h2>
                  </div>
                  <div className="content">
                    <span className="tag">
                      {puzzle ? puzzle?.tag : "general skills"}
                    </span>
                    <h1 className="title">
                      {puzzle ? puzzle?.title : "Binary"}
                    </h1>
                    <h3 className="points">
                      Points: {puzzle ? puzzle?.points : "10"}
                    </h3>
                    <p className="description">
                      {puzzle ? puzzle?.description : "Description..."}
                    </p>
                  </div>
                  <div className={`actions ${isCompleted() ? "solved" : ""}`}>
                    <svg
                      className="flagIcon"
                      width="34"
                      height="34"
                      viewBox="0 0 34 34"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.66661 32.1111C5.41613 32.1111 5.17591 32.0116 4.99879 31.8345C4.82167 31.6574 4.72217 31.4172 4.72217 31.1667V2.83336C4.72217 2.58288 4.82167 2.34266 4.99879 2.16554C5.17591 1.98842 5.41613 1.88892 5.66661 1.88892C5.91709 1.88892 6.15732 1.98842 6.33443 2.16554C6.51155 2.34266 6.61106 2.58288 6.61106 2.83336V31.1667C6.61106 31.4172 6.51155 31.6574 6.33443 31.8345C6.15732 32.0116 5.91709 32.1111 5.66661 32.1111Z"
                        fill="#A8CED0"
                      />
                      <path
                        d="M28.8528 3.60779C28.7092 3.5249 28.5463 3.48126 28.3806 3.48126C28.2148 3.48126 28.0519 3.5249 27.9083 3.60779C26.0774 4.37743 24.1044 4.7508 22.1189 4.70335C20.4083 4.57819 18.7423 4.09899 17.2267 3.29613C15.7632 2.52048 14.1558 2.05433 12.5044 1.92668C11.1319 1.91116 9.77018 2.17129 8.5 2.69168V4.79779C9.73046 4.12454 11.1113 3.77365 12.5139 3.77779C13.9028 3.91559 15.2509 4.32641 16.4806 4.98668C18.2374 5.90405 20.1687 6.4384 22.1472 6.55446C23.9234 6.56065 25.6904 6.29958 27.3889 5.78002V17.8972C25.6975 18.4976 23.9135 18.7949 22.1189 18.7756C20.4083 18.6504 18.7423 18.1712 17.2267 17.3684C15.7632 16.5927 14.1558 16.1266 12.5044 15.9989C11.1293 15.9953 9.7675 16.2684 8.5 16.8017V18.8889C9.73046 18.2157 11.1113 17.8648 12.5139 17.8689C13.9028 18.0067 15.2509 18.4175 16.4806 19.0778C18.2374 19.9952 20.1687 20.5295 22.1472 20.6456C24.4182 20.6928 26.6727 20.2515 28.7583 19.3517C28.9141 19.2732 29.0451 19.1531 29.1368 19.0048C29.2284 18.8564 29.2772 18.6855 29.2778 18.5111V4.41057C29.2801 4.25182 29.2424 4.09505 29.1681 3.95473C29.0938 3.81442 28.9854 3.6951 28.8528 3.60779Z"
                        fill="#A8CED0"
                      />
                    </svg>
                    {isCompleted() ? (
                      <input
                        className="input"
                        type="text"
                        ref={inputRef}
                        placeholder="SOLVED"
                        disabled
                      />
                    ) : (
                      <input
                        className="input"
                        type="text"
                        ref={inputRef}
                        placeholder="skiddie{FLAG}"
                        onChange={inputHandler}
                      />
                    )}
                    <button
                      className="button"
                      onClick={() => {
                        if (!isCompleted()) add();
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
              <div className="keyboard">
                <svg
                  width="1063"
                  height="122"
                  viewBox="0 0 1063 122"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.07142 90.5187L61.5613 8.51871C65.3048 3.17918 71.4164 0 77.9375 0H981.406C987.737 0 993.694 2.99764 997.467 8.08184L1058.32 90.0818C1068.11 103.279 1058.69 122 1042.25 122H20.4476C4.26045 122 -5.22106 103.773 4.07142 90.5187Z"
                    fill="#9E9E9E"
                  />
                  <g filter="url(#filter0_d)">
                    <path
                      d="M142.58 17.5H85.6561L64.5549 47H124.424L142.58 17.5Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M200.486 17.5H150.432L133.257 47H184.292L200.486 17.5Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M256.92 17.5H207.356L191.653 47H243.179L256.92 17.5Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M315.807 17.5H265.262L252.503 47H304.03L315.807 17.5Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M372.241 17.5H321.205L309.918 47H363.898L372.241 17.5Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M429.656 17.5H379.111L370.768 46H423.767L429.656 17.5Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M485.599 17.5H437.507L432.109 46H482.654L485.599 17.5Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M543.995 17.5H492.959L490.506 46H543.014L543.995 17.5Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M601.901 17.5H550.865V46H603.373L601.901 17.5Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M659.807 17.5H609.262L611.715 46H665.205L659.807 17.5Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M716.731 17.5H667.658L673.056 46H724.582L716.731 17.5Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M774.146 17.5H723.601L732.925 46H783.96L774.146 17.5Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M832.052 17.5H781.507L791.812 46H845.301L832.052 17.5Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M890.939 17.5H840.394L855.116 46H906.151L890.939 17.5Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M976.325 17.5H900.753L915.475 46H994.482L976.325 17.5Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M41 80.5L60.6291 53.5H151.414L135.22 80.5H41Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M212.264 53.5H157.302L142.58 80.5H198.523L212.264 53.5Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M272.623 53.5H218.152L204.903 80.5H259.373L272.623 53.5Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M267.716 80.5L279.003 53.5H331.51L321.205 80.5H267.716Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M391.87 53.5H338.871L330.038 80.5H385.981L391.87 53.5Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M393.342 80.5L399.721 53.5H453.701L450.266 80.5H393.342Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M456.646 80.5L459.59 53.5H512.588V80.5H456.646Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M519.459 80.5V53.5H574.911L575.401 80.5H519.459Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M581.29 80.5L580.309 53.5H633.307L637.724 80.5H581.29Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M696.12 53.5H642.14L646.066 80.5H701.518L696.12 53.5Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M756.48 53.5H702.99L711 80.5H765.313L756.48 53.5Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M816.839 54L763.35 53.5L772.674 80.5H829.107L816.839 54Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M879.161 54H823.709L836.959 80.5H892.902L879.161 54Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M900.263 80.5L886.522 54H999.88L1020 80.5H900.263Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                  </g>
                  <defs>
                    <filter
                      id="filter0_d"
                      x="29.0367"
                      y="8"
                      width="1002.98"
                      height="86.5"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      />
                      <feOffset dy="3" />
                      <feGaussianBlur stdDeviation="5" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow"
                        result="shape"
                      />
                    </filter>
                  </defs>
                </svg>
              </div>
            </>
          );
        }}
      </Popup>
      {popup ? (
        <>
          <div className="blackBox top"></div>
          <div className={`fog ${error ? "error" : ""}`}></div>
          <div className="blackBox bottom"></div>
          <ErrorPopup error={error}></ErrorPopup>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default ModalWindow;
