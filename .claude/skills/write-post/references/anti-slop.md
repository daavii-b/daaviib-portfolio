# Anti-slop rules

AI slop is text that is fluent, generic and interchangeable: it could sit in any post about any topic. Each rule
below names the pattern, why it hurts and what to write instead. Portuguese examples first, since posts start in pt.

## 1. Lexicon

Banned words and phrases (the checker flags them). Replace with the specific thing, or delete.

| Pattern                                                                                         | Instead                                                     |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| "No mundo atual", "Nos dias de hoje", "Cada vez mais", "In today's fast-paced world"            | Start with the problem itself.                              |
| "Neste artigo, vamos explorar/mergulhar/ver", "In this article we'll dive into"                 | Delete. The title and the table of contents already say it. |
| "mergulhar", "jornada", "explorar" (figurative), "dive", "journey", "delve"                     | The literal verb: ler, configurar, comparar.                |
| "robusto", "poderoso", "incrível", "revolucionário", "game changer", "seamless", "cutting-edge" | The property: "valida o frontmatter no build".              |
| "alavancar", "potencializar", "desbloquear", "elevar", "leverage", "unlock", "empower"          | usar, permitir, deixar.                                     |
| "É importante notar/ressaltar", "Vale a pena mencionar", "Vale ressaltar", "Note que"           | Say the thing. If it matters, it will show.                 |
| "Em resumo", "Em suma", "Concluindo", "Por fim, mas não menos importante", "In conclusion"      | Delete the sentence or the section.                         |
| "Espero que tenha gostado", "Deixe nos comentários", "Até a próxima", "Happy coding"            | Delete.                                                     |
| "Sem mais delongas", "Vamos lá!", "Bora" as a section opener                                    | Delete.                                                     |
| "simplesmente", "basicamente", "literalmente", "realmente" as filler                            | Delete.                                                     |
| "de forma eficiente/simples/eficaz"                                                             | Show the efficiency, or delete.                             |

## 2. Sentence patterns

- **"Não é apenas X, é Y" / "It's not X, it's Y".** Manufactured contrast. State Y.
- **Rhetorical question then answer.** "Mas por que isso importa? Porque…" → "Isso importa porque…", or just the
  reason.
- **Triads by reflex.** "rápido, seguro e escalável". Three adjectives sound complete and say nothing. Keep the one
  that is true and shown.
- **Em dashes as the default connector.** One per post at most in prose; use a period, a comma or parentheses.
  (Product strings like "Davi Brito — Blog" are not prose.)
- **Exclamation marks.** None in technical prose.
- **Emoji.** None in posts or headings.
- **Hedging stacks.** "pode ajudar a potencialmente melhorar" → "melhora" (if true) or nothing.
- **Imperatives to the reader as hooks.** "Imagine que…", "Pense em…". Use the real case instead.
- **Colon reveals.** "O segredo? Tipagem." Write the sentence.

## 3. Structure

- **Introduction and conclusion sections.** The post opens in the first real section and ends on what is left.
- **Recap ending.** A last paragraph that restates the sections. Readers just read them. Delete.
- **Generic headings.** "Introdução", "Por que isso importa", "Benefícios", "Conclusão", "Próximos passos" as a
  heading with nothing specific. Name the content: "Slugs traduzidos, rotas em inglês".
- **Bullets replacing reasoning.** A list of fragments where an argument should be. Write the argument as prose.
- **Bold everywhere.** Bold is for one term the reader must find again, rarely. Not for emphasis in every paragraph.
- **Uniform rhythm.** Every paragraph three sentences, every section the same length. Let short sections be short.
- **Padding sections.** "O que é Astro?" in a post for people who use Astro. Link the docs instead.
- **Fake balance.** "Claro, toda ferramenta tem prós e contras." Name the actual cost or skip it.

## 4. Content

- **Invented experience.** No anecdotes, clients, incidents or metrics that the author did not give. Use
  `{/* TODO(autor): … */}`.
- **Unsourced numbers.** "3x mais rápido". Only measured numbers, with how they were measured.
- **Generic advice.** "Escreva testes", "Pense na escalabilidade". Only advice that came out of this project's code.
- **Code that does not exist.** Snippets come from the repo. If simplified, say so in one line.
- **Explaining the obvious.** Do not define TypeScript to a TypeScript reader. Assume a working engineer.

## 5. Self-test before handing off

1. Could this paragraph appear unchanged in someone else's post? Rewrite it with a detail from this project.
2. Does each section say something the title did not? If not, merge or delete.
3. Read the first and last sentence of the post. Is the first one a fact and the last one not a summary?
4. Is there any sentence you would not say out loud to a colleague? Rewrite it as you would say it.
