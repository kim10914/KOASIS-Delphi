export type ScaleValue = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Participant = {
  name: string;
  birthDate: string;
  gender: string;
  job: string;
  region: string;
};

export type ImageResponse = {
  imageId: string;
  valence: ScaleValue;
  arousal: ScaleValue;
  respondedAt: string;
};

export type MoodQuadrant =
  | "highEnergyNegative"
  | "highEnergyPositive"
  | "lowEnergyNegative"
  | "lowEnergyPositive";

export type MoodMeter = {
  quadrant: MoodQuadrant;
  emotion: string;
};
