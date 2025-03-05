import React from 'react';

const ArrayVisualization = ({ name, array, colorClass = "bg-purple-100 text-purple-800" }) => {
  if (!array) return null;

  return (
    <div className="flex items-center">
      <span className="font-mono font-bold mr-2 w-24">{name}:</span>
      <div className="flex flex-wrap">
        {array.length > 0 ? (
          array.map((value, idx) => (
            <div key={idx} className="flex flex-col items-center mr-1">
              <div className={`${colorClass} px-3 py-1 rounded-md font-mono`}>
                {value}
              </div>
              <div className="text-xs text-gray-500">{idx}</div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 italic">empty</div>
        )}
      </div>
    </div>
  );
};

export default ArrayVisualization;