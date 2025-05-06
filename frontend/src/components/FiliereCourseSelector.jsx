import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FiliereCourseSelector = ({ filieres }) => {
  const [selectedFiliereId, setSelectedFiliereId] = useState(''); 
  const [selectedCourseId, setSelectedCourseId] = useState('');

  const selectedFiliere = filieres?.find((f) => f.id === parseInt(selectedFiliereId));
  const selectedCourse = selectedFiliere?.courses?.find((c) => c.id === parseInt(selectedCourseId));

  return (
    <div>
      
      <h2 className=" mt-9 mb-2 text-md font-medium px-5 hover:bg-gray-100 focus:ring-gray-200 dark:hover:bg-gray-800 dark:focus:ring-gray-800 text-gray-900 dark:bg-gray-800 dark:text-white">Select Filière and Course</h2>
      <hr className='container mb-6'></hr>
      <div className="flex justify-between items-end gap-2">
      <div className="w-full">
      <label className="mr-2 text-md font-medium px-5 hover:bg-gray-100 focus:ring-gray-200 dark:hover:bg-gray-800 dark:focus:ring-gray-800 text-gray-900 ">Filière:</label>
      <select
       className="w-full  text-md font-medium px-5 hover:bg-gray-100 focus:ring-gray-200 dark:hover:bg-gray-800 dark:focus:ring-gray-800 text-gray-900 " 
        value={selectedFiliereId}
        onChange={(e) => {
          setSelectedFiliereId(e.target.value);
          setSelectedCourseId(""); // Reset course when filiere changes
        }}
      >
        <option value=""  className="text-md font-medium px-5 hover:bg-gray-100 focus:ring-gray-200 dark:hover:bg-gray-800 dark:focus:ring-gray-800 text-gray-900 ">-- Choose Filière --</option>
        {filieres?.map((filiere) => (
          <option key={filiere.id} value={filiere.id}  className="text-md font-medium px-5 hover:bg-gray-100 focus:ring-gray-200 dark:hover:bg-gray-800 dark:focus:ring-gray-800 text-gray-900 ">
            {filiere.name}
          </option>
        ))}
      </select>
      </div>
      
      <div className="w-full">
          <label className="mr-2 text-md font-medium px-5 hover:bg-gray-100 focus:ring-gray-200 dark:hover:bg-gray-800 dark:focus:ring-gray-800 text-gray-900 ">Course:</label>
          <select
          className="w-full text-md font-medium px-5 hover:bg-gray-100 focus:ring-gray-200 dark:hover:bg-gray-800 dark:focus:ring-gray-800 text-gray-900 "
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
          >
            <option value="" className="text-md font-medium px-5 hover:bg-gray-100 focus:ring-gray-200 dark:hover:bg-gray-800 dark:focus:ring-gray-800 text-gray-900 ">-- Choose Course --</option>
            {selectedFiliere?.courses?.map((course) => (
              <option key={course.id} value={course.id} className="text-md font-medium px-5 hover:bg-gray-100 focus:ring-gray-200 dark:hover:bg-gray-800 dark:focus:ring-gray-800 text-gray-900 ">
                {course.title}
              </option>
            ))}
          </select>
          </div>
          <button className={` border px-10 h-11 bg-primary text-white rounded-sm2 ${
                (selectedFiliereId ==='' || selectedCourseId ==='')
                  ? "!bg-gray-400"
                  : ""
              }`} disabled={selectedFiliereId ==='' || selectedCourseId ===''}><Link to={`/chatroom/cours/${selectedCourse?.id}`}>Chat</Link></button>

        </div>
      

     
      {/* selectedFiliere && (
       <div style={{ marginTop: "1rem" }}>
          <h4>Selected Course Info</h4>
          <p>
            <strong>Title:</strong> {selectedCourse?.title}
          </p>
          <p>
            <strong>URL:</strong>{" "}
            <a href={selectedCourse?.url} target="_blank" rel="noreferrer">
              {selectedCourse?.url}
            </a>
          </p>
        </div>
         ) */}
 
    </div>
  );
};

export default FiliereCourseSelector;
