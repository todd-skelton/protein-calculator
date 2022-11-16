import HelpIcon from '@mui/icons-material/Help';
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from "@mui/lab";
import { Autocomplete, Box, Button, Stack, TextField, Typography } from "@mui/material";
import { Analytics } from '@vercel/analytics/react';
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
  const [showLow, setShowLow] = useState(false);
  const [showGood, setShowGood] = useState(false);
  const [showOptimal, setShowOptimal] = useState(false);
  const { rda, goodMin, optimalMin, highMin } = getProteinFromHeight(feetAndInchesToMeters(heightFt, heightIn));

  return (
    <Stack spacing={2}>
      <Typography variant="h3">Protein Calculator</Typography>
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
          <TimelineContent>
            <Button color="warning" onClick={() => setShowLow(!showLow)} endIcon={<HelpIcon />}>Low</Button>
          </TimelineContent>
        </TimelineItem>
        {showLow && <TimelineItem>
          <Box justifyContent="center" width="100%" display="flex">
            <Typography variant="body1" maxWidth={500}>
              The low range of protein intake spans from the RDA up to around 1.2 grams per kilogram (normalized to height here). Many will recognize the RDA as the optimal intake of protein. This is incorrect. The RDA is the minimum amount of protein required to prevent clinical deficiency. It should not be your goal. You are unlikely to retain lean mass at this level—especially in an energy deficit.
            </Typography>
          </Box>
        </TimelineItem>}
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
          <TimelineContent>
            <Button color="info" onClick={() => setShowGood(!showGood)} endIcon={<HelpIcon />}>Good</Button>
          </TimelineContent>
        </TimelineItem>
        {showGood && <TimelineItem>
          <Box justifyContent="center" width="100%" display="flex">
            <Typography variant="body1" maxWidth={500}>
              The current body of evidence shows a good range of protein intake spans from around 1.2 grams per kilogram up to around 1.6 grams per kilogram (normalized to height here). This is the range that most people will be able to retain lean mass while at maintenance. However, it will be difficult to retain lean mass in an energy deficit in this range.
            </Typography>
          </Box>
        </TimelineItem>}
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
          <TimelineContent>
            <Button color="success" onClick={() => setShowOptimal(!showOptimal)} endIcon={<HelpIcon />}>Optimal</Button>
          </TimelineContent>
        </TimelineItem>
        {showOptimal && <TimelineItem>
          <Box justifyContent="center" width="100%" display="flex">
            <Typography variant="body1" maxWidth={500}>
              The optimal range of protein intake spans from around 1.6 grams per kilogram up to around 2.2 grams per kilogram (normalized to height here). This is the range that most people will be able to retain lean mass while in an energy deficit. It is also the range that most people will be able to gain lean mass while in an energy surplus. Going above this range will not provide any additional benefit.
            </Typography>
          </Box>
        </TimelineItem>}
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
      <Analytics />
    </Stack>
  );
}