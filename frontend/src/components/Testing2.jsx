import * as React from 'react';
import Box from '@mui/joy/Box';
import CircularProgress from '@mui/joy/CircularProgress';
import Typography from '@mui/joy/Typography';

export default function ProblemProgress({ solved = 4, total = 20 }) {
  const progress = total === 0 ? 0 : Math.round((solved / total) * 100);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <CircularProgress
        determinate
        value={progress}
        size="lg"
        sx={{
          '--CircularProgress-size': '80px',
          '--CircularProgress-trackThickness': '6px',
          '--CircularProgress-progressThickness': '6px',
          '--CircularProgress-trackColor': '#222222', // background
          '--CircularProgress-progressColor': '#1976d2', // completed arc
        }}
      >
        <Typography level="title-sm" color="primary">
          {`${progress}%`}
        </Typography>
      </CircularProgress>
    </Box>
  );
}
