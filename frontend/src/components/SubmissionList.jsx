import {
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Cpu
} from "lucide-react";

const SubmissionsList = ({ submissions, isLoading, submissionId }) => {

  const safeParse = (data) => {
    if (!data || typeof data !== "string") return [];
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Error parsing data:", error);
      return [];
    }
  };

  const handleSubmissionId = (id) => {
    submissionId(id)
  }

  const calculateAverageMemory = (memoryData) => {
    const memoryArray = safeParse(memoryData).map((m) =>
      parseFloat(m.split(" ")[0])
    );
    if (memoryArray.length === 0) return 0;
    return (
      memoryArray.reduce((acc, curr) => acc + curr, 0) / memoryArray.length
    );
  };

  const calculateAverageTime = (timeData) => {
    const timeArray = safeParse(timeData).map((t) =>
      parseFloat(t.split(" ")[0])
    );
    if (timeArray.length === 0) return 0;
    return timeArray.reduce((acc, curr) => acc + curr, 0) / timeArray.length;
  };

  const getStatusConfig = (status) => {
    if (status === "Accepted") {
      return {
        color: "text-green-500",
        icon: <CheckCircle2 className="w-4 h-4" />,
      };
    } else {
      return {
        color: "text-red-500",
        icon: <XCircle className="w-4 h-4" />,
      };
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading submissions...</span>
        </div>
      </div>
    );
  }

  if (!Array.isArray(submissions) || submissions.length === 0) {
    return (
      <div className="text-center p-12">
        <div className="text-gray-400 text-lg mb-2">No submissions yet</div>
        <div className="text-gray-500 text-sm">Submit your solution to see results here</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-lg">
      <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="grid grid-cols-10 gap-4 text-sm font-medium text-gray-600 dark:text-gray-400">
          <div className="col-span-3">Status</div>
          <div className="col-span-2">Language</div>
          <div className="col-span-2">Runtime</div>
          <div className="col-span-3">Memory</div>
        </div>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {submissions.map((submission, index) => {
          const avgMemory = calculateAverageMemory(submission.memory);
          const avgTime = calculateAverageTime(submission.time);
          const statusConfig = getStatusConfig(submission.status);

          return (
            <div
              key={submission.id}
              className="px-4 py-4 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => handleSubmissionId(submission?.id)}
            >
              <div className="grid grid-cols-10 gap-4 items-center">
                <div className="col-span-3">
                  <div className={`flex items-center gap-2 ${statusConfig.color}`}>
                    {statusConfig.icon}
                    <div>
                      <div className="font-medium text-sm">
                        {submission.status}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white/80">
                    {submission.language}
                  </span>
                </div>

                <div className="col-span-2">
                  <div className="text-sm">
                    <div className="flex gap-2 font-medium text-white/80">
                      <Clock size={20} className="text-blue-400" />{avgTime.toFixed(3)} s
                    </div>
                  </div>
                </div>

                <div className="col-span-3">
                  <div className="text-sm">
                    <div className="flex gap-2 font-medium text-white/80">
                      <Cpu size={20} className="text-orange-400" />{avgMemory ? 1024 ? `${(avgMemory / 1024).toFixed(2)} MB` : `${avgMemory} KB` : "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show more button if there are many submissions */}
      {submissions.length > 10 && (
        <div className="p-4 text-center border-t border-gray-200 dark:border-gray-700">
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Show more submissions
          </button>
        </div>
      )}
    </div>
  );
};

export default SubmissionsList;