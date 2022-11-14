import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from "@mui/lab";
import { Autocomplete, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { useState } from "react";

const OPTIMAL_BMI = 21.5;
const RDA_PROTEIN_GRAMS_PER_KILOGRAM = 0.8;
const GOOD_MIN_PROTEIN_GRAMS_PER_KILOGRAM = 1.2;
const OPTIMAL_MIN_PROTEIN_GRAMS_PER_KILOGRAM = 1.6;
const HIGH_MIN_PROTEIN_GRAMS_PER_KILOGRAM = 2.2;
const POUNDS_TO_KILOGRAM_CONVERSION_FACTOR = 2.2046;
const INCHES_TO_METERS_CONVERSION_FACTOR = 0.0254;

const lbsToKg = (lbs: number): number =>
  lbs * POUNDS_TO_KILOGRAM_CONVERSION_FACTOR;

const feetAndInchesToMeters = (feet: number, inches: number) =>
  (feet * 12 + inches) * INCHES_TO_METERS_CONVERSION_FACTOR;

const getProteinFromHeight = (heightM: number): { rda: number, goodMin: number, optimalMin: number, highMin: number } => {
  const massKg = OPTIMAL_BMI * heightM * heightM;
  return getProteinFromMass(massKg);
}

const getProteinFromMass = (massKg: number): { rda: number, goodMin: number, optimalMin: number, highMin: number } => {
  const rda = massKg * RDA_PROTEIN_GRAMS_PER_KILOGRAM;
  const goodMin = massKg * GOOD_MIN_PROTEIN_GRAMS_PER_KILOGRAM;
  const optimalMin = massKg * OPTIMAL_MIN_PROTEIN_GRAMS_PER_KILOGRAM;
  const highMin = massKg * HIGH_MIN_PROTEIN_GRAMS_PER_KILOGRAM;
  return { rda, goodMin, optimalMin, highMin };
}

const heightFtOptions = [2, 3, 4, 5, 6, 7, 8];
const heightInOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export default function App() {
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(9);
  const { rda, goodMin, optimalMin, highMin } = getProteinFromHeight(feetAndInchesToMeters(heightFt, heightIn));

  return (
    <Stack spacing={2}>
      <Typography variant="h1">Protein Calculator</Typography>
      <Typography variant="body1">Height</Typography>
      <Stack direction="row" spacing={2}>
        <Autocomplete
          disablePortal
          id="combo-box-height-ft"
          options={heightFtOptions}
          sx={{ width: 100 }}
          value={heightFt}
          onChange={(_, newValue) => setHeightFt(newValue ?? 5)}
          renderInput={(params) => <TextField {...params} label="Feet" />}
        />
        <Autocomplete
          disablePortal
          id="combo-box-height-in"
          options={heightInOptions}
          sx={{ width: 100 }}
          value={heightIn}
          onChange={(_, newValue) => setHeightIn(newValue ?? 5)}
          renderInput={(params) => <TextField {...params} label="Inches" />}
        />
      </Stack>
      <Timeline>
        <TimelineItem>
          <TimelineOppositeContent>
            <Typography>{rda.toFixed(0)}g</Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color="error" />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent></TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>Low</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent>
            {goodMin.toFixed(0)}g
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color="warning" />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent></TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>Good</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent>
            {optimalMin.toFixed(0)}g
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color="info" />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent></TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>Optimal</TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineOppositeContent>
            {highMin.toFixed(0)}g
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color="success" />
          </TimelineSeparator>
          <TimelineContent></TimelineContent>
        </TimelineItem>
      </Timeline>
    </Stack>
  );
}