# 🎮 so-many-minigames

> A playground for building browser-based mini-games using AI coding tools. Let your creativity run wild!

This repo is for **everyone** — from curious beginners to seasoned engineers — to experiment with AI-assisted development in a fun, low-stakes environment. Pick a game idea, fire up your favourite AI tool, build it, and open a PR. That's it.

---

## 🕹️ Games So Far

| Game | File | Description |
|------|------|-------------|
| Snake | [`snake.html`](snake.html) | Classic snake with arrow key controls |
| Word Guesser | [`wordguesser.html`](wordguesser.html) | Guess the hidden word, Wordle-style |

---

## 🤖 Contributing a Game with AI

This repo is explicitly designed for AI-assisted contributions. Here's the workflow:

### 1. Pick your AI coding tool

There are many great options — choose what works for you:

| Tool | Best for |
|------|----------|
| [GitHub Copilot](https://github.com/features/copilot) | In-editor suggestions, chat, and agentic edits right inside VS Code |
| [Claude Code](https://docs.anthropic.com/en/docs/claude-code) | Terminal-based agentic coding — great for full-feature scaffolding |
| [OpenCode](https://opencode.ai/) | Open-source terminal AI agent that works with any model |
| [Pi](https://pi.ai/) | Conversational AI — great for brainstorming game ideas and logic |

### 2. Use an agentic workflow

Rather than asking for one function at a time, try giving your AI tool a full brief and letting it scaffold the entire game. Examples:

**Prompt to get started:**
```
Build a browser-based Tetris game in a single HTML file.
Use vanilla JS and CSS — no frameworks, no external dependencies.
The game should have: a score counter, increasing speed, and keyboard controls.
Keep the code under 300 lines.
```

**Agentic workflow tips:**
- Use **Copilot agent mode** or **Claude Code** to let the AI create multiple files at once
- Give the AI the existing `styles.css` as context so your game fits the site's look
- Ask the AI to write the `index.html` card for your game at the same time
- Let the AI iterate — ask it to fix bugs and add polish in follow-up messages

### 3. Fork, build, and open a PR

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR_USERNAME/so-many-minigames.git
cd so-many-minigames

# Create a branch for your game
git checkout -b add-tetris-game

# Build your game (with AI help!)
# ...

# Commit and push
git add .
git commit -m "Add Tetris game"
git push origin add-tetris-game
```

Then open a Pull Request on GitHub. That's it — no CI pipeline to fight, no strict review process. Just share what you made.

---

## 🧠 AI Tips & Tricks

Getting great results from AI tools is a skill. Here are some techniques to experiment with:

### Keep token usage low
- **Single-file games work great here** — ask the AI to put HTML, CSS, and JS all in one file. Fewer files = less context to load.
- Describe your game clearly upfront so the AI doesn't need to ask clarifying questions (fewer back-and-forth turns = cheaper).
- Use **`// ...existing code...`** comments when sharing code snippets — it tells the AI which parts it can skip re-reading.

### Pick the right model for the job
- **Fast, cheap models** (GPT-4o mini, Claude Haiku, Gemini Flash) are great for boilerplate, scaffolding, and simple game logic.
- **Frontier models** (GPT-4o, Claude Sonnet/Opus) shine when you're debugging tricky logic or want the AI to reason through a complex game mechanic.
- Start with a smaller model and only escalate if it's struggling.

### Context engineering
- Paste the existing `assets/styles.css` into your prompt — the AI will style your game to match the site automatically.
- Show the AI an existing game file (e.g. `snake.html`) as a reference for the expected structure.
- Be explicit about constraints: _"No external libraries. Vanilla JS only. Must work without a server."_
- **System prompts matter**: if your tool supports a system/custom instruction, tell it _"You are building a mini-game for a static GitHub Pages site. Keep everything self-contained."_

### Iterate, don't perfect
- Ship a v1 quickly, then use follow-up prompts to add features: _"Now add a high score that persists in localStorage"_ or _"Make the speed increase every 5 points"_.
- AI is great at small, focused follow-ups — you don't need to start over.

---

## 📁 Project Structure

```
/
├── index.html                  # Homepage — add your game card here
├── games/
│   ├── snake/
│   │   ├── index.html          # Snake game page
│   │   └── snake.js            # Snake game logic
│   └── wordguesser/
│       ├── index.html          # Word Guesser game page
│       └── wordguesser.js      # Word Guesser logic
├── assets/
│   └── styles.css              # Shared styles — reference this in your game
└── README.md
```

### Adding your game

1. Create `games/your-game/index.html` (link `../../assets/styles.css` for shared styles)
2. Add your game logic in `games/your-game/your-game.js`
3. Add a game card to `index.html` following the existing pattern
4. Open a PR 🎉

---

## 💡 Game Ideas

Stuck on what to build? Ask an AI to help you pick from this list:

- 🧱 Breakout / Arkanoid
- 🐸 Frogger
- 🚀 Space Invaders
- 🃏 Memory card flip
- 🎯 Whack-a-mole
- 🧩 Sliding puzzle
- 🎲 2048
- ✏️ Skribbl-style drawing game
- 🏓 Pong
- 📐 Geometry Dash-style runner

---

## 🔐 Ground Rules

- **Vanilla JS only** — no npm, no build tools, no frameworks. Everything must run by opening an HTML file.
- **Self-contained** — all assets should be inline or under `/assets/`. No CDN dependencies.
- **Fun > perfect** — rough edges are fine. The point is to experiment and share.
- **Credit your AI** — mention which tool you used in your PR description. We're all learning together.

---

## 📝 License

Free to use and modify.
