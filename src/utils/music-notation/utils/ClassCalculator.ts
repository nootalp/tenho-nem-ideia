import { HalfPound, Note  } from '../types/MusicalTypes';
import { NaturalNote, Accidental } from '../types/MusicalEnum';
import { KeyReference } from '../types/MusicalConst';
import * as Enum from "../types/MusicalEnum";

export class Calculator {
    readonly notes: HalfPound;
    
    constructor() {
        this.notes = KeyReference.NoteSet
    }

    /**
     * @param naturalNote Nota natural.
     * @param accidental Acidente.
     * @returns Soma da nota mais o acidente.
     */
    private calculateInterval(naturalNote: NaturalNote, accidental: Accidental): number {
        const naturalValue = KeyReference.BaseValues[naturalNote];
        const accidentalValue = KeyReference.AccidentalValues[accidental];
        return naturalValue + accidentalValue;
    }

    /**
     * Calcula a distância em semitons entre duas notas musicais.
     * A distância pode ser calculada no sentido horário ou anti-horário.
     * @param note0 Primeira nota
     * @param note1 Segunda nota
     * @param clockwise Indica se a distância deve ser calculada no sentido horário (ascendente).
     *                  Por padrão, é true (sentido horário).
     * @returns A distância em semitons entre as duas notas, de 0 a 11. */
    public calculateSemitoneDistance(note0: Note, note1: Note, clockwise: boolean = true): number {
        const semitones0 = this.calculateInterval(note0.charAt(0) as NaturalNote, note0.slice(1) as Accidental);
        const semitones1 = this.calculateInterval(note1.charAt(0) as NaturalNote, note1.slice(1) as Accidental);
        
        let distance = (semitones1 - semitones0 + (clockwise ? 0 : 12)) % 12;
        return distance === 0 ? 0 : distance;
    }   

    /**
     * @param root Nota a ser transposta.
     * @param semitones Semitons a serem adicionados a nota.
     * @returns Nota transposta.
     */
    public transposeNote(root: Note, semitones: number): Note {
        if (semitones === 0) return root;
    
        let rootInterval = this.calculateInterval(root.slice(0, 1) as NaturalNote, root.slice(1) as Accidental);
        let transposedInterval = (rootInterval + semitones) % 12;
    
        if (transposedInterval < 0) transposedInterval += 12;
    
        let transposedNote: Note = `${NaturalNote.C}${Accidental.Natural}`;    
        for (let note in this.notes) {
            if (this.notes[note as Note] === transposedInterval) {
                transposedNote = note as Note;
                break;
            }
        }
    
        return transposedNote;
    }

    public findKeyByValue(obj: Record<Enum.Accidental , number>, value: number): Enum.Accidental {
        return Object.keys(obj).find(key => obj[key as Enum.Accidental] === value) as Enum.Accidental;
    }
}