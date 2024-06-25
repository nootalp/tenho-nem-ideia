import { KeyReference } from "../types/MusicalConst"
import { NaturalNote, HarmonicSuffix } from "../types/MusicalEnum"
import { Note, HarmonicField, SemitoneDifference, MusicalDegree, HSInfo, Chord } from "../types/MusicalTypes"
import { Calculator } from "./ClassCalculator"
import { Scale } from "./ClassScale"

export class Harmony {
    private scale_First: Note[]
    private degree_Pattern
    private harmony_Field: HarmonicField
    private calc: Calculator
    private scale_Major: number[]

    /**
     * Cria uma instância da classe Harmony.
     * @param scale - A escala principal para formar os acordes.
     * @param chord_Degrees - O padrão de graus para formar os acordes.
     * @param scale_Instance - Instância da classe Scale que fornece o padrão de intervalos da escala.
     */
    constructor(scale: Note[], chord_Degrees: number[]) {
        this.scale_First = scale
        this.degree_Pattern = chord_Degrees 
        this.harmony_Field = {} as HarmonicField
        this.calc = new Calculator()
        this.scale_Major = [2, 2, 1, 2, 2, 2]
    }

    /** 
     * Gera o campo harmônico da escala associada.
     * @returns Um objeto com chaves representando os acordes e valores como um +
     *          array de notas que compõem esses acordes.
     */
    public setHarmonicField() {
        for (let i = 0; i < this.scale_First.length; i++) {
            let note_Reference = this.scale_First[i];
            let chord_Reference = this.getChord(note_Reference);
    
            const scale_Context = new Scale(note_Reference, this.scale_Major).setScale();

            const semitone_Difference = this.getScaleDifferences(scale_Context, this.scale_First);
            const degree_Formated = this.getAccidentalDegree(semitone_Difference);
            const chord_Extension = this.setChordExtension(degree_Formated);

            const extension = chord_Extension.join("");
            // console.log(`${degree_Formated.join(" ")}\n`)
            // // console.log(scale_Context.join(" "))
            // // console.log(semitone_Difference)
            this.harmony_Field[(note_Reference + extension) as Chord] = chord_Reference;
        }
        return this.harmony_Field;
    }
        
    /**
     * Forma acordes com base em um padrão de graus a partir de uma nota referência.
     * @param note_Reference - Nota referência na escala.
     * @returns Um array de notas que formam o acorde do grau da escala associada.
     */
    private getChord(note_Reference: Note): Note[] {
        const chord: Note[] = [];
        const note_Reference_Index = this.scale_First.indexOf(note_Reference);

        for (let i = 0; i < this.degree_Pattern.length; i++) {
            let degree_Index = (note_Reference_Index + this.degree_Pattern[i] - 1) % this.scale_First.length;
            let note = this.scale_First[degree_Index];
            
            chord.push(note);
        }
        return chord;
    }
    
    /**
     * Gera a diferença intervalar entre as notas das escalas de referência e contexto.
     * @param scale_First - Escala de referência.
     * @param scale_Second - Escala de contexto.
     * @returns Um objeto chave-valor onde cada chave é uma comparação de notas e o valor é um array contendo a diferença de semitons e um array com os graus das notas.
     */
    private getScaleDifferences(scale_First: Note[], scale_Second: Note[]): SemitoneDifference {
        const semitone_Differences: SemitoneDifference = {};
    
        scale_First.forEach(note_Context_Scale_Second => {
            let note_Context_Prefix = note_Context_Scale_Second.charAt(0) as NaturalNote;
            let equivalent_Notes = scale_Second.filter(note_Context_Scale_First => note_Context_Scale_First.charAt(0) === note_Context_Prefix);
    
            equivalent_Notes.forEach(note_Context_Scale_First => {
                let semitone_Difference = this.calc.calculateSemitoneDistance(note_Context_Scale_Second, note_Context_Scale_First);
                let degree_First = this.getDegree(scale_First, note_Context_Scale_Second);
                let degree_Second = this.getDegree(scale_Second, note_Context_Scale_First);
    
                let note_Name = `${note_Context_Scale_First} => ${note_Context_Scale_Second}`;
                semitone_Differences[note_Name] = [semitone_Difference, [degree_First, degree_Second]];
            });
        });

        return semitone_Differences;
    }
    
    /**
     * Obtém o grau de uma nota dentro de uma escala.
     * @param scale - A escala onde a nota está localizada.
     * @param note - A nota para a qual o grau deve ser determinado.
     * @returns O grau da nota na escala (1-based).
    */
    private getDegree(scale: Note[], note: Note): number {
        return scale.indexOf(note) + 1;
    }


    /**
     * Formata os graus das notas com base nas diferenças de semitons e compara com os graus de acordes dados.
     * @param semitone_Differences - Diferenças de semitons entre as notas das escalas.
     * @returns Um array de graus formatados com acidentes, filtrados pelos graus fornecidos.
     */
    public getAccidentalDegree(semitone_Differences: SemitoneDifference): HSInfo {
        const degree_Formated: HSInfo = []
        
        const chord_Degrees_Set = new Set<number>(this.degree_Pattern);


        for (let key in semitone_Differences) {
            let semitone_Diff = semitone_Differences[key][0];
            let degree = semitone_Differences[key][1][0];
            
            if (chord_Degrees_Set.has(degree)) {
                let accident = this.calc.findKeyByValue(KeyReference.AccidentalValues, semitone_Diff);
                degree_Formated.push((accident + degree) as MusicalDegree);
            }
        }
        
        return degree_Formated;
    }

    /**
     * Determina os sufixos de acorde com base nos graus formatados.
     * @param degree_Formated - Graus formatados para serem comparados com os padrões de sufixo.
     * @returns Um array de sufixos de acordes que correspondem aos padrões definidos em KeyReference.HarmonicSuffixes.
     */
    public setChordExtension(degree_Formated: MusicalDegree[]): HarmonicSuffix[] {
        const all_Matches = this.collectMatches(degree_Formated);
        const filtered_Matches = this.filterRedundantMatches(all_Matches);
        const sorted_Extensions = this.sortExtensions(filtered_Matches);
    
        // console.log(sorted_Extensions);
        return sorted_Extensions;
    }
    
    private sortExtensions(extensions: HarmonicSuffix[]): HarmonicSuffix[] {
        // console.log("Before Sorting:", extensions);
        
        const sorted = extensions.sort((a, b) => {
            const suffix_Pattern_A = KeyReference.HarmonicSuffixes[a];
            const suffix_Pattern_B = KeyReference.HarmonicSuffixes[b];
    
            const string_Pattern_A = suffix_Pattern_A.join('');
            const string_Pattern_B = suffix_Pattern_B.join('');
    
            // console.log(`Comparing: ${a} (${string_Pattern_A}) | ${b} (${string_Pattern_B})`);
    
            const start_Letter_A = /^[a-zA-Z]/.test(string_Pattern_A);
            const start_Letter_B= /^[a-zA-Z]/.test(string_Pattern_B);
    
            if (start_Letter_A && !start_Letter_B) return -1;
            if (!start_Letter_A && start_Letter_B) return 1;
            
            return string_Pattern_A.localeCompare(string_Pattern_B);
        });
    
        // console.log("After Sorting:", sorted);
        return sorted;
    }
    
        
    private collectMatches(degree_Formated: MusicalDegree[]): { Key: HarmonicSuffix, Pattern: MusicalDegree[] }[] {
        const all_Matches: { Key: HarmonicSuffix, Pattern: MusicalDegree[] }[] = [];
    
        for (let key in KeyReference.HarmonicSuffixes) {
            const suffix_Degree_Pattern = KeyReference.HarmonicSuffixes[key as HarmonicSuffix];
            if (this.patternMatch(suffix_Degree_Pattern, degree_Formated)) {
                all_Matches.push({ Key: key as HarmonicSuffix, Pattern: suffix_Degree_Pattern });
            }
        }
    
        return all_Matches;
    }
    
    private patternMatch(suffix_Degree_Pattern: MusicalDegree[], degree_Formated: MusicalDegree[]): boolean {
        const suffix_Pattern_Set = new Set<MusicalDegree>(suffix_Degree_Pattern);
        const degree_Formated_Set = new Set<MusicalDegree>(degree_Formated);
    
        return Array.from(suffix_Pattern_Set).every(degree => degree_Formated_Set.has(degree));
    }
    
    private filterRedundantMatches(all_Matches: { Key: HarmonicSuffix, Pattern: MusicalDegree[] }[]): HarmonicSuffix[] {
        const match_Keys: HarmonicSuffix[] = [];
    
        for (const match of all_Matches) {
            if (!all_Matches.some(otherMatch => 
                    otherMatch !== match && this.ateSubset(match.Pattern, otherMatch.Pattern))) {
                match_Keys.push(match.Key);
            }
        }
        
        return match_Keys;
    }
    
    private ateSubset(subset: string[], set: string[]): boolean {
        return subset.every(element => set.includes(element));
    }
    
}
