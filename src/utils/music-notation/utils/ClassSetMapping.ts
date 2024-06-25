import { Note, HalfPound } from '../types/MusicalTypes';
import { NaturalNote, Accidental } from '../types/MusicalEnum';
import { KeyReference } from '../types/MusicalConst';

export class MappingSet {

    constructor() {
        const methods = Object.getOwnPropertyNames(MappingSet.prototype).filter(name => {
            return name !== 'constructor' && typeof (this as any)[name] === 'function';
        });

        methods.forEach(method => {
            (this as any)[method]();
        });
    }

    private setNotes(): HalfPound {
        const halfPound = {} as HalfPound;
    
        for (const naturalNoteKey in KeyReference.BaseValues) {
            const naturalNote = naturalNoteKey as NaturalNote;
    
            for (const accidentalKey in KeyReference.AccidentalValues) {
                const accidental = accidentalKey as Accidental;
                const noteKey = `${naturalNote}${accidental}` as Note;
                let midiValue = KeyReference.BaseValues[naturalNote] + KeyReference.AccidentalValues[accidental];
    
                while (midiValue < 0) {
                    midiValue += 12;
                }
                while (midiValue > 11) {
                    midiValue -= 12;
                }
    
                halfPound[noteKey] = midiValue;
            }
        }
        KeyReference.NoteSet = halfPound
        return halfPound;
    }
    
    private setPound() {
        for (const naturalNote in KeyReference.BaseValues) {
            for (const accidental in KeyReference.AccidentalValues) {
                const noteKey = `${naturalNote}${accidental}` as Note;
                const naturalValue = KeyReference.BaseValues[naturalNote as NaturalNote];
                const accidentalValue = KeyReference.AccidentalValues[accidental as Accidental];
                KeyReference.HalfPoundSet[noteKey] = naturalValue + accidentalValue;
            }
        }
        return this
    }
    
    private setEnharmonyMap() {
        const notes = KeyReference.NoteSet;
        Object.keys(notes).forEach(noteKey => {
            const absValue = notes[noteKey as Note];
            const enharmonicNotes = Object.keys(notes)
                .filter(key => notes[key as Note] === absValue && key !== noteKey)
                .map(key => key as Note);            
            KeyReference.EnharmonicSet[noteKey as Note] = enharmonicNotes;
        });
        return this
    }

}