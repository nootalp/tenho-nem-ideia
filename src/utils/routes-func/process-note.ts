import express, { Request, Response } from 'express';
import { Scale } from '../music-notation/utils/ClassScale';
import { Harmony } from '../music-notation/utils/ClassHarmony';
import { HarmonicField, Note } from '../music-notation/types/MusicalTypes';

function convertStringToArray(input: string): number[] {
    return input.split(' ').map(Number);
}

function createScale(root: Note, intervals: number[]): Note[] {
    const scale = new Scale(root, intervals);
    return scale.setScale();
}

function calculateHarmony(scale_Notes: Note[], chordDegrees: number[]): HarmonicField | null {
    if (chordDegrees.length > 0) {
        const harmony = new Harmony(scale_Notes, chordDegrees);
        return harmony.setHarmonicField();
    }
    return null;
}

function formatResponse(scale: string, harmony: Record<string, string[]> | null): string {
    let formattedResponse = `${scale}<br>`;

    if (harmony) {
        formattedResponse += `<br><br>`;
        for (const [chord, notes] of Object.entries(harmony)) {
            formattedResponse += `${chord}: [ ${notes.join(', ')} ]<br>`;
        }
    }

    return formattedResponse;
}

export function setNote(req: Request, res: Response) {
    const { root, intervals, chord_degree } = req.body;

    const intervalArray = convertStringToArray(intervals);
    const scale_Notes = createScale(root, intervalArray);

    const chordDegreesArray = convertStringToArray(chord_degree as string);
    const harmony_Field = calculateHarmony(scale_Notes, chordDegreesArray);

    const response = formatResponse(scale_Notes.join(' '), harmony_Field);

    console.log(response.replace(/<br>/gi, '\n'));
    res.send(response);
}
