export default function countWords(text: string): number {
if (!text || text.trim().length === 0) return 0;

    const segmenter = new Intl.Segmenter('es', { granularity: 'word' });
    const segments = Array.from(segmenter.segment(text));

    return segments.filter(s => s.isWordLike).length;
}