import { useState, useRef, useEffect } from "react";
import { EllipsisVertical } from "lucide-react";
import { deleteProblem, getAllProblems } from "../store/Slices/problemSlice.js";
import { useDispatch } from "react-redux";

const Dropdown = ({problemId}) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleDelete = async (problemId) => {
    await dispatch(deleteProblem(problemId));
    await dispatch(getAllProblems());
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <EllipsisVertical
        className="text-white cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      />

      {isOpen && (
        <ul className="absolute right-0 mt-2 w-32 bg-zinc-800 rounded-md shadow-lg z-50 py-1 text-sm text-white border border-zinc-700">
          <li
            onClick={() => {
              setIsOpen(false);
            }}
            className="px-4 py-2 hover:bg-zinc-700 cursor-pointer"
          >
            Edit
          </li>
          <li
            onClick={() => {
              handleDelete(problemId);
            }}
            className="px-4 py-2 hover:bg-zinc-700 cursor-pointer"
          >
            Delete
          </li>
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
