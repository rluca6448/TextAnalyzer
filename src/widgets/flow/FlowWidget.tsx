import type { WidgetProps } from "../types";
import { spa } from 'stopword'; 
import TRANSITION_WORDS from './transitionWordsES.json';

export type FlowOptions = {
  scale: "percent" | "ten";
  showTarget: boolean;
  target: number;
};

// 1. Inicializamos las Stop Words
const STOP_WORDS = new Set(spa);

// 2. Mini-Lematizador (Stemmer) para conectar palabras de la misma familia
function getRoot(word: string): string {
  let w = word.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (w.length <= 4) return w.replace(/s$/, ""); 
  return w.replace(/mente$/, "").replace(/(ciones\vert{}cion\vert{}dades\vert{}dad)$/, "")
          .replace(/(ando|iendo|ado|ido)$/, "").replace(/(ar\vert{}er\vert{}ir)$/, "")
          .replace(/[aeiou]s?$/, "").replace(/es$/, ""); 
}

// 3. Cálculo matemático del "Hilo"
function computeFlow(text: string): number | null {
  if (!text || text.trim().length === 0) return null;

  const segmenterSentence = new Intl.Segmenter('es', { granularity: 'sentence' });
  const rawSentences = Array.from(segmenterSentence.segment(text))
                            .map(s => s.segment.trim())
                            .filter(s => s.length > 0);
  
  const rawWords = text.toLowerCase().match(/[a-záéíóúüñ]+/g) || [];
  
  // Necesitamos algo de texto para analizar el flujo
  if (rawSentences.length < 3 || rawWords.length < 20) return null;

  // --- MÉTRICA 1: ESTRUCTURA (Conectores) ---
  let connectorsFound = 0;
  const lowerText = text.toLowerCase();
  
  TRANSITION_WORDS.forEach(connector => {
    const regex = new RegExp(`(?:^|[^a-záéíóúüñ])(${connector})(?:[^a-záéíóúüñ]|$)`, 'g');
    const matches = lowerText.match(regex);
    if (matches) connectorsFound += matches.length;
  });
  
  // Ratio ideal: ~0.3 conectores por oración
  let structuralScore = Math.min(100, (connectorsFound / rawSentences.length) / 0.3 * 100);

  // --- MÉTRICA 2: PROGRESIÓN TEMÁTICA (Cohesión de ideas) ---
  const sentenceRoots = rawSentences.map(sentence => {
    const words = sentence.toLowerCase().match(/[a-záéíóúüñ]+/g) || [];
    return words.filter(w => w.length > 3 && !STOP_WORDS.has(w)).map(getRoot); 
  });

  let connectedSentences = 0;
  for (let i = 1; i < sentenceRoots.length; i++) {
    const currentIdeas = new Set(sentenceRoots[i]);
    const previousIdeas = sentenceRoots[i - 1] || [];
    
    // Si comparten alguna raíz, se conectan
    if (previousIdeas.some(idea => currentIdeas.has(idea))) {
      connectedSentences++;
    }
  }

  const thematicScore = (connectedSentences / (sentenceRoots.length - 1)) * 100;
  
  // Peso final: 60% progresión de ideas, 40% conectores estructurales
  return Math.round((thematicScore * 0.6) + (structuralScore * 0.4));
}

function getFlowLabel(score: number): string {
  if (score >= 80) return "Excellent idea progression";
  if (score >= 60) return "Good flow";
  if (score >= 40) return "Ideas somewhat jumpy";
  return "Disconnected ideas";
}

// 4. El Componente React
export default function FlowWidget({ text, options }: WidgetProps<FlowOptions>) {
  const score = computeFlow(text ?? "");
  
  // Fallbacks para evitar crashes si options no carga a tiempo
  const scale = options?.scale ?? "percent";
  const showTarget = options?.showTarget ?? true;
  const target = options?.target ?? 70;

  const maxScale = scale === "percent" ? 100 : 10;
  const normalizedScore = score !== null ? (scale === "ten" ? (score / 10).toFixed(1) : score) : null;
  const widthPercentage = score !== null ? `${score}%` : "0%";
  const targetPercentage = scale === "percent" ? target : target * 10;

  return (
    <div>
      <div className="ta-big">
        {normalizedScore ?? "—"}
        <span className="ta-muted"> / {maxScale}</span>
      </div>

      {score !== null && (
        <p className="ta-muted" style={{ marginTop: "-0.5rem", marginBottom: "0.5rem" }}>
          {getFlowLabel(score)}
        </p>
      )}

      {/* Aviso si el texto es muy corto */}
      {text && text.trim().length > 0 && score === null && (
        <p className="ta-muted" style={{ marginTop: "-0.5rem", marginBottom: "0.5rem", fontSize: "0.85em" }}>
          Need at least 3 sentences to analyze flow.
        </p>
      )}

      <div className="ta-bar" aria-hidden="true">
        <div 
          className="ta-bar-fill" 
          style={{ 
            width: widthPercentage,
            backgroundColor: score !== null && score < 40 ? "#ef4444" : undefined 
          }} 
        />
        {showTarget && (
          <div 
            className="ta-bar-target" 
            style={{ left: `${targetPercentage}%` }} 
          />
        )}
      </div>
      
      {showTarget && (
        <p className="ta-muted">Target: {target}{scale === "percent" ? "%" : ""}</p>
      )}
    </div>
  );
}