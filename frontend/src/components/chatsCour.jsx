import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../hook/useFetch";
import Loading from "./Loading";
import { LuSend } from "react-icons/lu";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import parse from "html-react-parser";
import AutoResizableTextarea from "./AutoResizableTextarea";
import { time } from "../utils/time";
import { Dropdown } from "flowbite-react";
import { IoMdSettings } from "react-icons/io";
import TableComponent from "./TableComponents";

function ChatsCour({ fileData }) {
  const { id } = useParams();
  const {
    data: messagesData,
    error: messagesError,
    isLoading: messagesIsLoading,
    fetchData,
  } = useFetch(`/api/chat/filiere/messages/${id}`);
  const [question, setQuestion] = useState("");
  const [pdf_questions, setPdfQuestions] = useState([]);
  const [pdf_summary, setPdfSummary] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [showSetting, setShowSetting] = useState(false);
  const [language, setLanguage] = useState("Auto-detect");
  const [model, setModel] = useState("Mistral");

  const [messages, setMessages] = useState([]);
  const axiosInstance = useAxiosPrivate();
  const [showingLetters, setShowingLetters] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!messagesIsLoading && messagesData && messagesData.length > 0) {
      try {
   
        /* const questions_ex = messagesData[1].message.toString(); */
        
        /* const sanitizedMessage = messageString.replace(/\\/g, ""); */

     /*    const parsedMessage = JSON.parse(questions_ex);
        console.log(parsedMessage);
        setPdfQuestions(parsedMessage);
        setPdfSummary(messagesData[0].message); */
      } catch (error) {
        console.error("Error parsing JSON data:", error);
      }
      setMessages(messagesData);

    }
  }, [id, messagesData, messagesIsLoading, axiosInstance]);

  useEffect(() => {
    fetchData();
  }, [fileData]);

  const handleSubmit = async (question_p = "", task = "response") => {
   
    setShowingLetters(false);
    setIsLoading(true);
    const currentTime = new Date();
    const formattedTime = currentTime.toISOString();
    question_p = typeof question_p === "string" ? question_p : question;
    setMessages([
      ...messages,
      { message: question_p, is_user_message: true, create_at: formattedTime },
    ]);
    const question_temp = question_p
    setQuestion("");

    try {
      

      const response = await axiosInstance.post(`/api/chat/filiere/${id}`, {
        question: question_temp,
        language: language,
        model: model,
        document: id,
        task: task,
      });
      
     
      
      setCurrentIndex(0);
      const currentTime = new Date();
      const formattedTime = currentTime.toISOString();
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: response.data.message,
          is_user_message: false,
          create_at: formattedTime,
        },
      ]);
      setShowingLetters(true);
      setQuestion("");
    } catch (error) {
      console.error("Error submitting question:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const providedQuestion = (question) => {
    handleSubmit(question);
  };
  /*   const extractData = () => {
    handleSubmit('Extract Data','data');
  }; */

  useEffect(() => {
    let timeout;
    if (
      showingLetters &&
      currentIndex < messages[messages.length - 1]?.message.length
    ) {
      const randomDelay = Math.floor(Math.random() * (10 - 5) + 1) + 10;
      const randomUpdate = Math.floor(Math.random() * (5 - 1) + 1) + 5;

      timeout = setTimeout(() => {
        setCurrentIndex((prevIndex) => prevIndex + randomUpdate);
      }, randomDelay);
    } else {
      setShowingLetters(false);
    }
    return () => clearTimeout(timeout);
  }, [showingLetters, currentIndex, messages]);

  

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "auto", block: "end" });
    }
  }, [messages, currentIndex]);

  return (
    <div className="bg-white relative flex flex-col border pt-2 w-full h-[85vh] ">
      <div className="flex  flex-1 overflow-y-scroll w-full h-[87vh] flex-col py-5 px-3 gap-5">
        {messagesIsLoading ? (
          <Loading padding={3} />
        ) : (
          <>
            { messages &&
              messages.map((message, index) => {
                const isLastMessage = messages.length === index + 1;
                const isFirstMessage = false;
                return (
                  <div
                    key={index}
                    className={`flex ${
                      message.is_user_message ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      ref={isLastMessage ? chatEndRef : null}
                      className={`max-w-[83%] break-words		 flex flex-col gap-1 leading-7 text-sm py-3 rounded-md px-4 ${
                        message.is_user_message
                          ? " bg-primary !text-white"
                          : " bg-gray-100"
                      }`}
                    >
                      {isFirstMessage ? (
                        <div className="flex flex-col gap-2 leading-7 text-sm response_style">
                          <p>{parse(pdf_summary)}</p>
                        </div>
                      ) : (
                        <div className="flex flex-col break-words	 gap-2 leading-7 text-sm response_style">
                          {message.is_user_message ? (
                            // Render user message directly
                            <p className="!text-white whitespace-pre-wrap	break-all	">
                              {message.message}
                            </p>
                          ) : showingLetters && isLastMessage ? (
                            parse(message.message.slice(0, currentIndex + 1))
                          ) : (
                            parse(message.message)
                          )}
                        </div>
                      )}

                      
                        <span
                          className={`text-end text-[0.7rem] ${
                            message.is_user_message
                              ? "text-white"
                              : "text-gray-600"
                          }`}
                        >
                          {time(message.create_at).hours}:
                          {time(message.create_at).minutes}{" "}
                          {time(message.create_at).amPm}
                        </span>
                    
                    </div>
                  </div>
                );
              })}

            {isLoading && (
              <div className={`flex justify-start`}>
                <p
                  className={`max-w-[73%] text-sm py-2 rounded-md px-3 flex gap-3 items-center text-left `}
                >
                  <Loading color="#9ca3af" />{" "}
                  {
                    // <span className="text-gray-900">en reflexion....</span>
                  }
                </p>
              </div>
            )}

            {!showingLetters &&
              !isLoading &&
              pdf_questions &&
              pdf_questions.length > 0 && (
                <ul className="flex flex-col gap-3">
                  {pdf_questions.map((question, index) => (
                    <button
                      onClick={() => providedQuestion(question)}
                      key={index}
                      className={`border border-gray-200 hover:border-primary w-fit px-3 py-2 rounded-full  text-sm text-gray-600 text-left `}
                    >
                      <span className="font-bold">{index + 1}. </span>{" "}
                      {question}
                    </button>
                  ))}
                </ul>
              )}
          </>
        )}
      </div>

      <div className="flex flex-col left-0 bottom-0 w-full bg-white p-3">
        {showSetting && (
          <div className="mb-4 flex items-center gap-3">
            <div className="[&>button]:border focus:[&>button]:ring-0 hover:[&>button]:border-primary [&>button]:border-gray-300 [&>button]:rounded-sm   flex items-center gap-4 [&>button>span>svg]:ml-5  [&>button]:text-gray-700">
              <span className="text-gray-700 text-sm">Response in </span>{" "}
              <Dropdown className="" label={language} placement="top">
                <Dropdown.Item onClick={() => setLanguage("Auto-detect")}>
                  Auto-detect
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setLanguage("English")}>
                  English
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setLanguage("French")}>
                  French
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setLanguage("Arabic")}>
                  Arabic
                </Dropdown.Item>
              </Dropdown>
            </div>
            <div className="[&>button]:border focus:[&>button]:ring-0 hover:[&>button]:border-primary [&>button]:border-gray-300 [&>button]:rounded-sm   flex items-center gap-4 [&>button>span>svg]:ml-5  [&>button]:text-gray-700">
              <span className="text-gray-700 text-sm">Use Model :  </span>{" "}
              <Dropdown className="" label={model} placement="top">
                <Dropdown.Item onClick={() => setModel("Mistral")}>
                  Mistral
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setModel("Finetuned BERT")}>
                Finetuned BERT

                </Dropdown.Item>
                
              </Dropdown>
            </div>
          </div>
        )}

        <div className="flex  items-end p-2 border border-gray-150 rounded-sm2 w-full relative ">
          <AutoResizableTextarea
            placeholder={"Saisissez votre question ici..."}
            value={question}
            handleInput={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <div className=" right-2 flex items-center gap-2 bottom-2">
         {/*    <button
              className={` text-primary border  rounded-sm2  w-9 h-9 flex justify-center items-center ${
                isLoading || (fileData && !fileData.processed)
                  ? "!bg-gray-400 border-gray-400 !text-white"
                  : "border-primary"
              }`}
              onClick={() => setShowSetting(!showSetting)}
              disabled={isLoading || (fileData && !fileData.processed)}
            >
              <IoMdSettings className="text-xl" />
            </button> */}
            <button
              className={`bg-primary text-white   rounded-sm2  w-9 h-9 flex justify-center items-center ${
                isLoading || (fileData && !fileData.processed)
                  ? "!bg-gray-400"
                  : ""
              }`}

              type="submit"
              onClick={handleSubmit}
              disabled={isLoading || (fileData && !fileData.processed)}
            >
              <LuSend className="text-xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatsCour;
