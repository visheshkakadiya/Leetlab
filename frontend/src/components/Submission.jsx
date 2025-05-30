import { Clock, Cpu, TrendingUp, User, Loader2 } from "lucide-react";
import { BarChart } from "@mui/x-charts/BarChart";

export function Submission({ submission }) {

  if(!submission) {
    return <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin" size={24} />
    </div>;
  };
  console.log("Submission: ", submission);
  const testCaseLength = submission.testCases.length;

  const safeParse = (data) => {
    if (!data || typeof data !== "string") return [];
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Error parsing data:", error);
      return [];
    }
  };

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

  const timeArray = safeParse(submission.time).map((t) =>
    parseFloat(t.split(" ")[0])
  );
  const memoryArray = safeParse(submission.memory).map((m) =>
    parseFloat(m.split(" ")[0])
  );

  const avgTime = calculateAverageTime(submission.time);
  const avgMemory = calculateAverageMemory(submission.memory);

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden">
      <div className="min-h-screen bg-[#222222] p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-6 border border-white/20 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div>
                <h1
                  className={`text-lg font-semibold mb-0.5 ${
                    submission.status === "Accepted"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {submission.status}
                </h1>
                {submission.status === "Accepted" && (
                  <p className="text-white/70 text-xs">
                    {testCaseLength} / {testCaseLength} test cases passed
                  </p>
                )}
              </div>
              <button className="px-2 py-2 bg-white/20 rounded-lg border border-white/20 text-white text-sm hover:bg-white/30 transition-all duration-300 hover:cursor-pointer">
                See Solution
              </button>
            </div>

            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
              <div className="bg-gradient-to-r from-blue-400 to-purple-500 rounded-full p-1.5">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-white/80 text-xs">
                {submission.user.name} • Submitted on{" "}
                {new Date(submission.createdAt).toLocaleDateString()} - {submission.language}
              </span>
            </div>
          </div>

          {/* Performance and Chart Section */}
          {submission.status === "Accepted" ? (
            <>
              {/* Performance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Runtime */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-blue-500/20 rounded-lg p-2">
                      <Clock className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-white font-medium text-base">
                      Runtime
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-bold text-white">
                        {avgTime.toFixed(3)}
                      </span>
                      <span className="text-white/70 text-sm mb-1">s</span>
                    </div>
                    <button className="flex items-center gap-1 text-purple-200 hover:text-white text-xs">
                      <TrendingUp className="w-4 h-4" />
                      Analyze
                    </button>
                  </div>
                </div>

                {/* Memory */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-orange-500/20 rounded-lg p-2">
                      <Cpu className="w-5 h-5 text-orange-400" />
                    </div>
                    <h3 className="text-white font-medium text-base">Memory</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-bold text-white">
                        {avgMemory > 1024
                          ? `${(avgMemory / 1024).toFixed(2)}`
                          : `${Math.round(avgMemory)} KB`}
                      </span>
                      <span className="text-white/70 text-sm mb-1">MB</span>
                    </div>
                    <div className="text-white/50 text-xs">
                      Great memory efficiency
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Runtime Chart */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg hover:bg-white/15 transition-all duration-300">
                  <h3 className="text-white font-medium text-base mb-4">
                    Runtime per Test Case
                  </h3>
                  <BarChart
                    height={200}
                    series={[
                      { data: timeArray, label: "Time (sec)", color: "#3B82F6" },
                    ]}
                    xAxis={[
                      {
                        data: timeArray.map((_, i) => `Test ${i + 1}`),
                        scaleType: "band",
                      },
                    ]}
                    yAxis={[{ label: "Time (sec)" }]}
                  />
                </div>

                {/* Memory Chart */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg hover:bg-white/15 transition-all duration-300">
                  <h3 className="text-white font-medium text-base mb-4">
                    Memory per Test Case
                  </h3>
                  <BarChart
                    height={200}
                    series={[
                      {
                        data: memoryArray,
                        label: "Memory (KB)",
                        color: "#F97316",
                      },
                    ]}
                    xAxis={[
                      {
                        data: memoryArray.map((_, i) => `Test ${i + 1}`),
                        scaleType: "band",
                      },
                    ]}
                    yAxis={[{ label: "Memory (KB)" }]}
                  />
                </div>
              </div>
            </>
          ) : (
            // Non-Accepted: Show error output
            <div className="bg-white/10 text-white/80 text-sm p-4 rounded-xl border border-white/20">
              {submission?.stderr || submission?.compileOutput ? (
                <>
                  <p className="text-red-500 font-medium">Error Output</p>
                  <pre className="whitespace-pre-wrap break-words mt-2">
                    {submission.stderr || submission.compileOutput}
                  </pre>
                </>
              ) : (
                <p>No error output available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
