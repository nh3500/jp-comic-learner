import express from 'express';
import cors from 'cors';
import kuromoji from 'kuromoji';
import path from 'path';

export interface Token {
  surface: string;
  reading: string;
  pos: string;
  basic: string;
}

const app = express();
app.use(cors());
app.use(express.json());

let tokenizer: kuromoji.Tokenizer<kuromoji.IpadicFeatures> | null = null;

const tokenizerReady = new Promise<void>((resolve, reject) => {
  kuromoji
    .builder({ dicPath: path.join(__dirname, 'node_modules/kuromoji/dict/') })
    .build((err: Error | null, t: kuromoji.Tokenizer<kuromoji.IpadicFeatures>) => {
      if (err) {
        reject(err);
        return;
      }
      tokenizer = t;
      resolve();
    });
});

app.get('/health', (_req, res) => {
  res.json({ status: tokenizer ? 'ready' : 'loading' });
});

app.post('/tokenize', async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    res.status(400).json({ error: 'text field is required' });
    return;
  }

  if (!tokenizer) {
    await tokenizerReady;
  }

  const tokens: Token[] = tokenizer!.tokenize(text).map((t: kuromoji.IpadicFeatures) => ({
    surface: t.surface_form,
    reading: t.reading || '',
    pos: t.pos,
    basic: t.basic_form,
  }));

  res.json({ tokens });
});

export { app, tokenizerReady };

if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  tokenizerReady.then(() => {
    app.listen(PORT, () => {
      console.log(`Tokenization server running on port ${PORT}`);
    });
  });
}
