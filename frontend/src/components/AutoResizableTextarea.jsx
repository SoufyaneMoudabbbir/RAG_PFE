import React, { useState, useRef, useEffect } from "react";

function AutoResizableTextarea({handleInput ,value , placeholder, onKeyDown}) {
  
  const textareaRef = useRef(null);

  // Automatically resize the textarea to fit its content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textareaRef && textarea) {
      textarea.style.height = "auto"; // Reset height to auto to recalculate scroll height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height to the scroll height
    }
  }, [value]);



  return (
    <textarea
      ref={textareaRef}
      className="w-[100%] border-0 bg-transparent text-sm focus:ring-0 focus:border-0 outline-none resize-none"
      placeholder={placeholder}
      value={value}
      onChange={handleInput}
      onKeyDown={onKeyDown}
    />
  );
}

export default AutoResizableTextarea;
