# A Fun Way to Learn with Kitty-Explain Skill for Agents


<cc-blog-meta author="Tomomi Imura" date="August 18, 2026" image="../../../../assets/authors/tomomi-imura.jpg"></cc-blog-meta>

![Kitty explain](https://raw.githubusercontent.com/microsoft/m365-copilot-agents-playbook/main/01-extend/images/screenshot-skill.png)

I hope you joined [The Microsoft 365 Copilot Agent's Playbook | Microsoft Reactor](https://aka.ms/M365AgentsPlaybook) Livecast. If not, it's not too late to catch up, because this article walks you through the demo from the episode 1. Let's explore how the Kitty Explain skill brings a playful, visual twist to learning with agents.

## 🐱 Kitty Explain Skill

**Kitty Explain** is a skill that generates a "Kitty Explain" meme-style cat visual explainer that makes complex ideas feel more approachable.

[📺 Watch the demo on YouTube](https://youtu.be/173fx_0X7gg)

In this demo, the skill is used with the *Simple Learn* agent, which uses Microsoft Learn documentation to summarize complex topics and explain them in simple language.

Because **skills are reusable packages of instructions and resources**, you can also use the **Kitty Explain** skill with other agents whenever it suits the use case. Let's say I have another agent called *Explain-to-Me*, who explains content from a given URL. This skill works well with the agent.

![skill](https://raw.githubusercontent.com/microsoft/m365-copilot-agents-playbook/main/01-extend/images/skill.png)

**kitty-explain** skill contains a `SKILL.md` file (instructions in plain markdown, with YAML metadata up top) plus reference folder with cat meme images to be references.

```bash
📂 kitty-explain
    ├── 📄 SKILL.md
    └── 📂 references
      ├── 📄 kitty01.png
      ├── 📄 kitty02.png
      └── 📄 ...
```


## 💪 How to use the skill in an agent

The skill source code is located in another GitHub repo (so you probably want to open in a new browser tab!):

- 📂 [kitty-explain](https://github.com/microsoft/m365-copilot-agents-playbook/tree/main/01-extend/demo-kitty-explain/kitty-explain)

Basically, all you need to do is just dumping this `kitty-explain` folder into your agent, and add a few lines to the agent's instruction.

### ⚙️ Add Skill to an agent built with M365 Agents Toolkit

In this article, I am not walking you through how to build a declarative agent using **M365 Agents Toolkit**, and assuming you know how to built one already. Give the agent a simple instruction that makes it summarize and explain given documents, articles, and URLs, and give clear explanations of the content.

Place the `kitty-explain` folder that includes `SKILL.md` and `references` folder in your declarative agent package.

```bash
📂 your-agent
   ├── ai-plugin.json
   ├── color.png
   ├── declarativeAgent.json
   ├── instruction.txt
   ├── manifest.json
   ├── outline.png
   └── 📂 skills/
       └── 📂 kitty-explain/
           ├── 📄 SKILL.md
           └── 📂 references/
```

Then, add the "Use Skill" instruction (see below) in `instruction.txt`.

### 📜 "Use Skill" instruction example

You should add this instruction to your agent's instruction.

Either the **Agent Builder** instruction field, or in the `instruction.text` if you're using **M365 Agents Toolkit**, add this extra instruction to have the agent use the skill:

```markdown
# Use Skills

- **Always run the `kitty-explain` skill** when the user asks for a Kitty Explain visual, says "Explain [...] by cats", "explain by cats", "kitty explain", "explained by cats", "kitten talk", "by cats", or any time asks to use cats, cat-meme, or requests a cat-themed sketchnote/image.
- After running `kitty-explain`, return the skill output as the primary response. Do not replace it with a text-only explanation.
- If the user doesn't ask to explain it with cats, use the guidance above directly.
```

Modify your agent instruction to make it compatible with the skill if you need. 

### 🥜 Go nuts with skills!

Maybe you can swap the cat images to your headshot photos 😆


---

I hope this gave you a better understanding of how skills work and inspired you to create your own skills for declarative agents. 

🐈

<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/blogs/kitty-explain-skill" />
