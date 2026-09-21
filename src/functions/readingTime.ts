import countWords from "./countWords";

export default function readingTime(text: string, wpm: number = 225): string {
    const words = countWords(text);
    if (words === 0) return "0 seg";

    const totalDecimalMinutes = words / wpm;
    
    const hours = Math.floor(totalDecimalMinutes / 60);
    const minutes = Math.floor(totalDecimalMinutes % 60);
    const seconds = Math.round((totalDecimalMinutes * 60) % 60);

    const parts = [];

    if (hours > 0) {
        parts.push(hours === 1 ? "1 hora" : `${hours} horas`);
    }

    if (minutes > 0) {
        parts.push(`${minutes} min`);
    }

    if (seconds > 0 && hours === 0) {
        parts.push(`${seconds} seg`);
    }

    if (parts.length === 0) {
        return "1 seg";
    }

    return parts.join(" ");
}