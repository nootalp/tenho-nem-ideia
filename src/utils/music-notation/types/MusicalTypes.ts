import * as Enum from "./MusicalEnum"

export type MusicalDegree = `${Enum.Accidental}${number}`;
export type HSInfo = MusicalDegree[];

export type Note =  `${Enum.NaturalNote}${Enum.Accidental}`;
export type Chord = `${Note}${Enum.HarmonicSuffix}`;

export type HarmonicField = { [key in Chord]: Note[] };
export type HalfPound =     { [key in Note]: number };
export type EnharmonicMap = { [key in Note]: Note[] };

export type SemitoneDifferenceEntry = [number, [number, number]];
export type SemitoneDifference = { [noteName: string]: SemitoneDifferenceEntry };
