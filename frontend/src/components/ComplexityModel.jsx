import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from '../helper/axiosInstance.js';
import { Cpu, Gauge, MemoryStick, Microchip, X, Loader2 } from 'lucide-react';
import Loader from './Loader.jsx';

const ComplexityModal = ({ sourceCode, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [complexity, setComplexity] = useState(null);

  const modalRef = useRef(null);

  useEffect(() => {
    const getComplexity = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.post('/ai/code-complexity', { sourceCode });
        const cleanUp = response.data.data.replace(/```json\n?/, '').replace(/\n?```$/, '').trim();
        const parsedData = JSON.parse(cleanUp);
        setComplexity(parsedData);
        setError(null);
      } catch (error) {
        console.log("Error getting complexity", error);
        setError("Failed to analyze code.");
      } finally {
        setLoading(false);
      }
    };

    getComplexity();
  }, [sourceCode]);

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div
      className="bg-black/50 fixed inset-0 z-50 flex justify-center items-center backdrop-blur-sm p-4"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-neutral-900 w-80 p-5 rounded-xl shadow-lg text-white flex flex-col space-y-4 relative"
        ref={modalRef}
      >
        <button
          className="absolute top-2 right-2 text-white hover:text-white/50 transition"
          onClick={onClose}
          aria-label="Close"
        >
          <X />
        </button>

        <h3 className="text-lg font-semibold border-b border-neutral-700 pb-2 flex items-center gap-2">
          <MemoryStick className="w-5 h-5 text-green-400" />
          Complexity Result
        </h3>

        {loading ? (
          <div className="text-sm text-gray-400 flex items-center gap-2">
            <Loader />
            Analyzing code...
          </div>) : error ? (
            <div className="text-sm text-red-500">{error}</div>
          ) : complexity ? (
            <>
              <div className="text-sm flex items-center gap-2">
                <Gauge className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300 font-medium">Time Complexity:</span>
                <span className="text-blue-400 ml-auto">
                  {complexity.time_complexity || 'N/A'}
                </span>
              </div>
              <div className="text-sm flex items-center gap-2">
                <Cpu className="w-4 h-4 text-orange-400" />
                <span className="text-gray-300 font-medium">Space Complexity:</span>
                <span className="text-blue-400 ml-auto">
                  {complexity.space_complexity || 'N/A'}
                </span>
              </div>
            </>
          ) : (
          <div className="text-sm text-gray-400">No result available.</div>
        )}
      </div>
    </div>
  );
};

export default ComplexityModal;
