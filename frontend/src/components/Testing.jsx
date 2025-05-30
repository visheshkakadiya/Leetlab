import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export function Testing() {
  // Simulated DB data
  const dbTimes = ["0.16 sec", "0.17 sec", "0.117 sec"];
  console.log(dbTimes);

  // Convert to float numbers (seconds)
  const timeValues = dbTimes.map(t => parseFloat(t));

  return (
    <div>
      <h2>Test Case Execution Times</h2>
      <BarChart
        height={200}
        width={300}
        borderRadius={5}
        xAxis={[
          {
            id: 'testcases',
            data: dbTimes.map((_, idx) => `case ${idx + 1}`),
            scaleType: 'band',
          },
        ]}
        series={[
          {
            data: timeValues,
            label: 'Time (sec)',
            color: '#A855F7',
          },
        ]}
        yAxis={[{ label: 'Time (sec)', }]}
      />
    </div>
  );
}
