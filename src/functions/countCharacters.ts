export default function countCharacters(text: string): number {
if (!text) return 0;
    
    return [...text.trim()].length;
}