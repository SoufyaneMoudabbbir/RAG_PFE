import { useState } from "react";
import useAxiosPrivate from "../hook/useAxiosPrivate";
import { useFileContext } from "../Service/Context";
import { Link , useNavigate   } from 'react-router-dom';

const quiz = [
  { question: "Your name?" },
  { question: "Your favorite tool?" },
  { question: "Your experience with React?" },
  { question: "What do you want to learn next?" },
  { question: "What’s your favorite project?" }
];

export function QuizComponent() {
  const [answers, setAnswers] = useState(Array(quiz.length).fill(""));
  const [submitted, setSubmitted] = useState(false);
  const axiosInstance = useAxiosPrivate();
  const { token, user, logout } = useFileContext();
  const navigateTo = useNavigate()
  const handleChange = (value, index) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    const formattedAnswers = quiz.map((q, i) => ({
            question: q.question,
            answer: answers[i],
          }));
          
          
     /*  const response = await axiosInstance.post("/api/quiz/exam_result", { responses: formattedAnswers });
      console.log("Server response:", response.data); */
      setSubmitted(true);
      navigateTo("/user/login", { state: { quizAnswers: formattedAnswers } });

    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  return (
    <div className="p-4 h-full overflow-y-auto">
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {quiz.map((item, index) => (
            <div key={index}>
              <label className="block mb-1 font-medium text-gray-800">
                {index + 1}. {item.question}
              </label>
              <input
                type="text"
                value={answers[index]}
                onChange={(e) => handleChange(e.target.value, index)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Your answer"
                required
              />
            </div>
          ))}
          <button
            type="submit"
            className="border  bg-primary text-white rounded-sm2 px-4 py-2 "
          >
            Submit
          </button>
        </form>
      ) : (
        <div>
          <h4 className="text-lg font-semibold mb-2">Answers Submitted:</h4>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            {quiz.map((q, i) => (
              <li key={i}>
                <strong>{q.question}</strong>: {answers[i]}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
