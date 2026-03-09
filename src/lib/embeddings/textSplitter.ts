export function chunkText(text: string, maxTokens: number = 300): string[] {
    const chunks: string[] = [];
    // Split sentences using regex
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    
    let currentChunk = "";
    
    for (let sentence of sentences) {
        if (currentChunk.length + sentence.length > maxTokens && currentChunk.length > 0) {
            chunks.push(currentChunk.trim());
            currentChunk = "";
        }
        currentChunk += sentence + " ";
    }
    
    if (currentChunk.trim().length > 0) {
        chunks.push(currentChunk.trim());
    }
    
    return chunks;
}
