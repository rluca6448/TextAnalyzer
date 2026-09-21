export default function countSentences(text: string): number {
    if (!text || text.trim().length === 0) return 0;

    const segmenter = new Intl.Segmenter('es', { granularity: 'sentence' });
    const segments = Array.from(segmenter.segment(text));

    return segments.filter(s => s.segment.trim().length > 0).length;
}