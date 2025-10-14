# 🎯 Your Model Selection Adventure

**What you will do:**

- **Identify the Problem**: Understand why model selection matters for your agents
- **Explore the Model Landscape**: Discover different AI models and their superpowers
- **Test Models Hands-On**: Use GitHub Models Playground to compare real outputs
- **Build Selection Confidence**: Make informed decisions for your own agents
- **Iterate and Improve**: Refine your approach through experimentation

This blog walks you through picking the right AI model for your agents. It's basically like choosing the right tool for the job, get it right and your agent actually works well instead of being just okay.

---

## 📖 Introduction

Building Copilot agents is exciting, but here's a secret: the instructions you write are only half the story. The AI model powering your agent plays a massive role in how it behaves, what it can do, and how well it performs.

Think about it, you could write the perfect instructions for an agent to analyze medical images, but if you choose a text-only model, it simply won't work. Or imagine asking a model optimized for speed to write a creative story, it might give you something generic or worse a sloppy rap song when you wanted poetic prose.

Using this blog,  which can also be seen as a hands-on workshop, you'll create confidence in model selection by exploring, testing, and comparing different AI models using the **GitHub Models Playground**. By the end, you'll understand which models excel at what tasks, and you'll have practical experience making these choices yourself.

---

## 🔍 Step 1: Identify the Problem

**Problem:** You're building Copilot agents, but you're not sure which AI model to use. Some models seem fast but generic. Others are powerful but expensive. How do you choose?

**Real-World Scenario:** Imagine you're building an agent to help your team summarize lengthy meeting transcripts. You try one model and get back a wall of text that barely helps. You try another and get a concise, actionable summary. What made the difference? The model.

**Solution:** Learn to match models to tasks through hands-on experimentation.

**Goal:** By the end of this journey, you'll confidently select the right model for common tasks like:

- Summarizing documents 📄
- Transcribing audio 🎙️
- Analyzing images 🖼️
- Generating creative content ✍️

---

## 🗺️ Step 2: Explore the Model Landscape

Just like AI agents benefit from having a clear role, different models have distinct personalities and strengths. Let's meet the cast:

### 🎭 Your Model Toolkit

| Task | Recommended Models | Key Features | When to Use |
|------|-------------------|--------------|-------------|
| **Summarize Document** | [Mistral Small](https://github.com/marketplace/models/azureml-mistral/mistral-small-2503)| Concise, context-aware, accurate | Condensing reports, articles, meeting notes |
| **Transcribe Audio** | [Phi-4 Multimodal](https://github.com/marketplace/models/azureml/Phi-4-multimodal-instruct)| Multimodal, accurate speech recognition | Converting podcasts, meetings, interviews to text |
| **Analyze Image** | [OpenAI o3](https://github.com/marketplace/models/azure-openai/o3) | Vision capabilities, annotation, detail extraction | Reading charts, analyzing photos, extracting data |
| **Generate Content** | [GPT-5 mini](https://github.com/marketplace/models/azure-openai/gpt-5-mini) | Fluent, creative, versatile writing | Drafting emails, posts, reports, stories |

???+ info "why these models?"
     We’ve chosen Mistral, Phi-4, OpenAI o-series, and OpenAI gpt-series to give you a clear starting point. These families represent diverse strengths and approaches, helping you understand key options before exploring others.


Think of these models like a kitchen full of specialized tools. You wouldn't use a butter knife to chop vegetables, and you wouldn't use a cleaver to spread jam. Each model has its sweet spot.

---

## 🧪 Step 3: Hands-On Experimentation with GitHub Models Playground

Now comes the fun part where you will actually test these models! The GitHub Models Playground is your sandbox for experimentation. Here's where the magic happens.

> You'll need a [GitHub account](https://github.com/signup) to proceed. 

### Getting Started

**Step-by-step exploration:**

1. **Visit the Playground**  
   Head to [GitHub Models Marketplace](https://github.com/marketplace/models)

2. **Pick Your First Model**  
   Start with something familiar like GPT-4 for document summarization

3. **Create Your Test Prompt**  
   Paste a document you want summarized, or upload an image you want analyzed

4. **Run It and Review**  
   Observe what the model produces. Is it concise? Accurate? Readable?

5. **Switch Models and Compare**  
   Now try the same prompt with a different model—say, Mistral or Phi-4

6. **Take Notes**  
   Document differences in clarity, accuracy, style, and speed

### 💡 Pro Tips for Testing

**The Same-Prompt Method:**  
Use identical prompts across multiple models. This is your control variable. When you see different outputs, you know it's the model and not your instructions thats making the difference.

**Example Test Scenario:**  
Let's say you want to summarize a 2000-word research article about climate change.

- **Test with GPT-4:** Notice how it organizes key points
- **Test with Mistral Small:** See if it's more concise or detailed
- **Test with Phi-4:** Compare readability and structure

You might discover that GPT-4 gives you nuanced insights, while Mistral Small delivers lightning-fast summaries perfect for quick overviews.

### 🎨 Testing for Image Analysis

Upload the same image to different vision-capable models:

- **OpenAI o3:** Might excel at detailed descriptions
- **GPT-5 mini:** Could be better at extracting specific data from charts

The playground removes the guesswork and you see real results in real time.

---

## 🔄 Step 4: Review, Iterate, and Improve

Model selection isn't a one-and-done decision. It's a process of continuous refinement.


## 🚀 Bonus step: Cost and other important stuff

 This final step is a bonus, but powerful.
You can compare costs, quality and other things for models using [leaderboard](https://ai.azure.com/explore/models/leaderboard)

## 📚 Resources

Want to dive deeper? Explore these resources:

| Task | GitHub  |Azure AI Foundry | Watch a video | Deep dive labs |
|------|-------------------|--------------|-------------|-------------|
| **Summarize Document** | [Mistral Small](https://github.com/marketplace/models/azureml-mistral/mistral-small-2503)|[Mistal Small](https://ai.azure.com/explore/models/Mistral-small/version/1/registry/azureml-mistral?tid=3724f11b-e7b2-41d9-92a6-05ff649e1c18)| [Watch now](https://www.youtube.com/watch?v=tqOecUt_wCc&list=PLmsFUfdnGr3wzz6a4E-Szksg92JPng-AL&index=5&pp=iAQB) | [Learn more](https://github.com/microsoft/Build25-LAB324) |
| **Transcribe Audio** | [Phi-4 Multimodal](https://github.com/marketplace/models/azureml/Phi-4-multimodal-instruct)|[Phi-4-multimodal-instruct](https://ai.azure.com/explore/models/Phi-4-multimodal-instruct/version/2/registry/azureml?tid=3724f11b-e7b2-41d9-92a6-05ff649e1c18)| [Watch now](https://www.youtube.com/watch?v=VLQKZq8L9Uk&list=PLmsFUfdnGr3wzz6a4E-Szksg92JPng-AL&index=2) | [Learn more](https://github.com/microsoft/PhiCookBook/blob/main/md/02.Application/05.Audio/Phi4/Transciption/README.md) |
| **Analyze Image** | [OpenAI o3](https://github.com/marketplace/models/azure-openai/o3) | [OpenAI o3](https://ai.azure.com/explore/models/o3/version/2025-04-16/registry/azure-openai?tid=3724f11b-e7b2-41d9-92a6-05ff649e1c18)|[Watch now](https://www.youtube.com/watch?v=ffxUEenM4B8&list=PLmsFUfdnGr3wzz6a4E-Szksg92JPng-AL&index=12&pp=iAQB)| [Learn more](https://github.com/microsoft/BUILD25-LAB333) |
| **Generate Content** | [GPT-5 mini](https://github.com/marketplace/models/azure-openai/gpt-5-mini) |[gpt-5-mini](https://ai.azure.com/explore/models/gpt-5-mini/version/2025-08-07/registry/azure-openai?tid=3724f11b-e7b2-41d9-92a6-05ff649e1c18) | [Explore](https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/introducing-model-mondays-%E2%80%93-your-ai-model-power-up/4390773)| TBD |

---

## 🎬 Final Thoughts

Choosing the right AI model is like casting the perfect actor for a role. You wouldn't cast an action hero in a romantic comedy, and you wouldn't ask a model optimized for speed to write poetry.

The GitHub Models Playground gives you a risk-free stage to audition different models, see them perform, and make informed casting decisions for your agents.

The more you experiment, the sharper your instincts become. Soon, you'll look at a task and immediately know which model will shine.

