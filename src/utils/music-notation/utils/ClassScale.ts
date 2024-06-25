import { KeyReference } from "../types/MusicalConst"
import { Accidental, NaturalNote } from "../types/MusicalEnum"
import { Note } from "../types/MusicalTypes"

export class Scale {
    private note_Reference: Note
    private visited_Prefixes: Set<NaturalNote>
    public interval_Pattern: number[]

    constructor(note_Reference: Note, interval_Pattern: number[]) {
        this.note_Reference = note_Reference
        this.visited_Prefixes = new Set()
        this.interval_Pattern = interval_Pattern
    }

    public setScale(): Note[] {
        const scale: Note[] = []
        
        if (this.isDouble(this.note_Reference)) {
            const enharmonies = KeyReference.EnharmonicSet[this.note_Reference]
            // console.log(enharmonies)
        }

        scale.push(this.note_Reference)
        this.visited_Prefixes.add(this.note_Reference[0] as NaturalNote)
        // console.log(this.note_Reference)
        
        for (const interval_Reference of this.interval_Pattern) {
            let note_Reference_Value = KeyReference.NoteSet[this.note_Reference]
            this.note_Reference = this.getTarget(interval_Reference, note_Reference_Value)
            // console.log(this.note_Reference)
            
            scale.push(this.note_Reference)

            // console.log(this.visited_Prefixes)

            this.visited_Prefixes.add(this.note_Reference[0] as NaturalNote)
        }


        return scale
    }


    private isDouble(note: Note): boolean {
        const accident = note.slice(1) as Accidental 
        const double = Accidental.DoubleFlat || Accidental.DoubleSharp

        if (accident == double) 
            return true
        else 
            return false
    }


    private getTarget(interval_Reference: number, note_Reference_Value: number): Note {
        const note_Target_Value = (note_Reference_Value + interval_Reference) % 12;
        let note_Next: Note | undefined = undefined;
    
        note_Next = this.findCriteria((note_Context: Note) => {
            return this.isTrueNote(note_Context, note_Target_Value);
        });
    
        if (!note_Next) {
            note_Next = this.findCriteria((note_Context: Note) => {
                const note_Context_Value = KeyReference.NoteSet[note_Context];
                const note_Context_Prefix = note_Context[0] as NaturalNote;
                return (
                    note_Context_Value === note_Target_Value &&
                    !this.visited_Prefixes.has(note_Context_Prefix)
                );
            });
        }
    
        if (!note_Next) {
            note_Next = this.findCriteria((note_Context: Note) => {
                const note_Context_Value = KeyReference.NoteSet[note_Context];
                return note_Context_Value === note_Target_Value;
            });
        }
    
        return note_Next as Note;
    }
    
    private findCriteria(criteria: (note: Note) => boolean): Note {
        return Object.keys(KeyReference.NoteSet)
            .find(note => criteria(note as Note)) as Note;
    }
    
    private isTrueNote(note: Note, note_Target_Value: number): boolean {
        const note_Context_Prefix = note[0] as NaturalNote;
        const is_Target = KeyReference.NoteSet[note] === note_Target_Value;
        const was_Visited_Prefix = !this.visited_Prefixes.has(note_Context_Prefix);
        const note_Reference_Prefix_Value = KeyReference.NoteSet[this.note_Reference[0] as NaturalNote]
        
        const is_Context_Prefix_Greater = KeyReference.NoteSet[note_Context_Prefix] >= note_Reference_Prefix_Value;
    
        return is_Target && was_Visited_Prefix && is_Context_Prefix_Greater;
    }
}