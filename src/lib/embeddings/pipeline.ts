import { pipeline, env } from '@xenova/transformers';

// Skip local model check since we are downloading from Hugging Face
env.allowLocalModels = false;
env.useBrowserCache = false;

class PipelineSingleton {
    static task = 'feature-extraction';
    static model = 'Xenova/all-MiniLM-L6-v2';
    static instance: any = null;

    static async getInstance(progress_callback?: any) {
        if (this.instance === null) {
            // @ts-ignore
            this.instance = pipeline(this.task, this.model, { progress_callback });
        }
        return this.instance;
    }
}

export async function getEmbeddings(text: string) {
    const embedder = await PipelineSingleton.getInstance();
    const result = await embedder(text, { pooling: 'mean', normalize: true });
    return Array.from(result.data);
}
