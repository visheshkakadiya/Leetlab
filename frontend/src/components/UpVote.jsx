import { toggleUpVotes } from '@/store/Slices/toggleSlice';
import { ArrowUp } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

function UpVote({
    isUpVoted,
    UpVoteCount,
    discussionId,
    size = 20
}) {

    const dispatch = useDispatch();
    const [localIsUpVoted, setLocalIsUpVoted] = useState(isUpVoted);
    const [localUpVoteCount, setLocalUpVoteCount] = useState(UpVoteCount);

    const handleToggle = () => {
        if (localIsUpVoted) {
            setLocalUpVoteCount((prev) => prev - 1);
        } else {
            setLocalUpVoteCount((prev) => prev + 1);
        }

        setLocalIsUpVoted((prev) => !prev);

        if (discussionId) {
            dispatch(toggleUpVotes(discussionId));
        }
    }

    useEffect(() => {
        setLocalIsUpVoted(isUpVoted);
        setLocalUpVoteCount(UpVoteCount);
    }, [isUpVoted, UpVoteCount]);

    return (
        <button
            className={`flex items-center cursor-pointer space-x-1 transition-colors hover:text-green-300 ${localIsUpVoted ? "text-green-400" : "text-gray-500"
                }`}
            onClick={handleToggle}
        >
            <ArrowUp className="w-6 h-6" style={{ width: size, height: size }} /> {/* Use size prop */}
            <span className="text-sm" style={{ fontSize: size * 0.7 }}>
                {localUpVoteCount || 0}
            </span>
        </button>
    )
}

export default UpVote