import * as Enum from "./MusicalEnum";
import * as Type from "./MusicalTypes"
import { MappingSet } from "../utils/ClassSetMapping";

export namespace KeyReference {
    export const BaseValues: Record<Enum.NaturalNote, number> = {
        [Enum.NaturalNote.C]: 0,
        [Enum.NaturalNote.D]: 2,
        [Enum.NaturalNote.E]: 4,
        [Enum.NaturalNote.F]: 5,
        [Enum.NaturalNote.G]: 7,
        [Enum.NaturalNote.A]: 9,
        [Enum.NaturalNote.B]: 11,
    };

    export const AccidentalValues: Record<Enum.Accidental, number> = {
        [Enum.Accidental.DoubleFlat]: -2,
        [Enum.Accidental.Flat]: -1,
        [Enum.Accidental.Natural]: 0,
        [Enum.Accidental.Sharp]: 1,
        [Enum.Accidental.DoubleSharp]: 2,
    };

    export const HarmonicSuffixes: Record<Enum.HarmonicSuffix, Type.HSInfo> = {
        [Enum.HarmonicSuffix.Minor]: ['♭3'],
        [Enum.HarmonicSuffix.Major]: ['3'],
        [Enum.HarmonicSuffix.Fourth]: ['4'],
        [Enum.HarmonicSuffix.Augmented]: ['𝄰5'],
        [Enum.HarmonicSuffix.Sixth]: ['6'],
        [Enum.HarmonicSuffix.DominantSeventh]: ['♭7'],
        [Enum.HarmonicSuffix.MajorSeventh]: ['7'],
        [Enum.HarmonicSuffix.DiminishedTriad]: ['♭3', '♭5'],
        [Enum.HarmonicSuffix.HalfDiminishedSeventh]: ['♭3', '♭5', '♭7'],
        [Enum.HarmonicSuffix.DiminishedSeventh]: ['♭3', '♭5', '♭♭7'],
    };

    export let NoteSet = {} as Type.HalfPound;
    export const HalfPoundSet= {} as Type.HalfPound;
    export const EnharmonicSet = {} as Type.EnharmonicMap;

    new MappingSet();
}
