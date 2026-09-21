export default function countParagraphs(text: string): number {
    if (!text || text.trim().length === 0) return 0;

    return text
        .split(/[\r\n]+/)
        .filter(paragraph => paragraph.trim().length > 0)
        .length;
}