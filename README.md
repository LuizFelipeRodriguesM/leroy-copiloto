# Leroy Copiloto

Assistente de IA para a jornada do cliente dentro da loja física da Leroy Merlin. O cliente conta o problema do jeito dele, o Charles faz as perguntas que um vendedor faria, monta a lista com quantidade, corredor e estoque, traça a rota na loja e, na frente da prateleira, circula na foto o produto certo.

Enterprise Challenge 2026 (FIAP, Engenharia de Software).

## Fluxo

1. **Conta o problema** (texto ou foto) em `/app`.
2. **Perguntas geradas na hora:** a IA escolhe de 1 a 3 perguntas e o componente de cada uma (cartões com ícone, escolha curta, número com unidade, várias escolhas ou texto). Os componentes já existem no código; a IA só escolhe quais usar e o conteúdo.
3. **Lista e rota numa tela só:** só com produtos do catálogo da loja, com a conta da quantidade, os itens que o cliente costuma esquecer e o substituto quando o produto acabou. O mapa no topo mostra as paradas na ordem mais curta da entrada ao caixa, e os itens vêm agrupados por corredor, cada um com o botão "Qual desses?".
4. **Qual desses?:** foto da prateleira; a IA marca o produto certo e explica por que os parecidos não servem.

## Como rodar

Requisitos: Node 20 ou mais novo e uma chave gratuita do Gemini (Google AI Studio).

```bash
npm install
```

Crie o arquivo `.env.local` na raiz:

```
GEMINI_API_KEY=sua-chave
```

Opcional: `GEMINI_TEXT_MODELS` e `GEMINI_VISION_MODELS` (lista separada por vírgula) trocam a ordem dos modelos. Se um modelo estourar a cota grátis ou estiver sobrecarregado, o servidor tenta o próximo da lista.

```bash
npm run dev
```

Abra `http://localhost:3000` (landing) e `http://localhost:3000/app` (o copiloto).

## Estrutura

| Caminho | O que tem |
|---|---|
| `src/app/page.tsx` | Landing |
| `src/app/app/page.tsx` | O copiloto (fluxo completo) |
| `src/app/api/questions` | Gera as perguntas e escolhe os componentes |
| `src/app/api/list` | Monta a lista a partir do catálogo |
| `src/app/api/shelf` | "Qual desses?": acha o produto na foto da prateleira |
| `src/lib/copilot` | Esquemas (zod), prompts, chamada ao Gemini e validação das respostas |
| `src/lib/store` | Catálogo, estoque, corredores, mapa e rota da loja de exemplo |
| `src/components/copilot` | Telas do copiloto |
| `src/components/landing` | Seções da landing |
| `public/charles-3d.html` | Charles, o mascote em 3D (three.js) |

## Tecnologias

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, zod, Google Gemini (`@google/genai`) e three.js. A chave do Gemini fica só no servidor.

## Créditos

- Fotos de prateleira: Wikimedia Commons (licenças livres, créditos no rodapé da landing).
- Charles em 3D com [open-bot-avatar](https://github.com/DominikScholz/open-bot-avatar) (MIT) e three.js.
- Projeto acadêmico, sem vínculo comercial com a Leroy Merlin.
