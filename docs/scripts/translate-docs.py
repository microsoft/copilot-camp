"""
translate-docs.py: Translate Markdown documentation to multiple languages using Azure OpenAI.

USAGE:
1. (Recommended) Create and activate a Python virtual environment:
   python -m venv venv
   source venv/bin/activate
2. Install requirements:
   pip install -r requirements.txt
3. Set up your .env file with Azure OpenAI credentials:
   AZURE_OPENAI_ENDPOINT_URL=...
   AZURE_OPENAI_DEPLOYMENT_NAME=...
   AZURE_OPENAI_API_KEY=...
4. Run the script:
   python docs/scripts/translate-docs.py

- Translated files will be created under docs/<lang_code>/.
- After translation, language-specific includes will be moved to docs/includes/<lang_code>/.

NOTE:
If new sections have been added in ToC in mkdocs.yml, you still need to edit it manually!

"""

import os
import shutil
from dotenv import load_dotenv
from openai import AzureOpenAI
from concurrent.futures import ThreadPoolExecutor

load_dotenv()

endpoint = os.getenv("AZURE_OPENAI_ENDPOINT_URL")
model = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "o3")
subscription_key = os.getenv("AZURE_OPENAI_API_KEY")

# Initialize Azure OpenAI client with key-based authentication
client = AzureOpenAI(
    azure_endpoint=endpoint,
    api_key=subscription_key,
    api_version="2025-01-01-preview",
)

ENABLE_CODE_SNIPPET_EXCLUSION = True
# gpt-4.5 needed this for better quality
ENABLE_SMALL_CHUNK_TRANSLATION = False

SEARCH_EXCLUSION = """---
search:
  exclude: true
---
"""

# Define the source and target directories
source_dir = "docs"
languages = {
    "ja": "Japanese",
    # Add more languages here, e.g., "fr": "French", "zh": "Chinese"
}

# Define dictionaries for translation control
do_not_translate = [
    "Copilot",
    "Copilot Developer Camp",
    "Copilot Studio",
    "Microsoft 365",
    "M365",
    "Azure",
    "Microsoft Foundry",
    "OpenAI",
    "Visual Studio",
    "Visual Studio Code",
    "VS Code",
    "Agents SDK",
    "MCP",
    "SharePoint",
    # Add more terms here
]

eng_to_non_eng_mapping = {
    "ja": {
        "agents": "エージェント",
        "lab": "ラボ",
        "Maker Path": "Maker 向けコース",
        "license": "ライセンス",
        "user": "ユーザー",
        "disclaimer": "注意事項",
        "parameter": "パラメーター",
        "processor": "プロセッサー",
        "server": "サーバー",
        "web search": "Web 検索",
        "file search": "ファイル検索",
        "streaming": "ストリーミング",
        "system prompt": "システムプロンプト",
        # Add more Japanese mappings here
    },
    # Add more languages here
}

def built_instructions(target_language: str, lang_code: str) -> str:
    do_not_translate_terms = "\n".join(do_not_translate)
    specific_terms = "\n".join(
        [f"* {k} -> {v}" for k, v in eng_to_non_eng_mapping.get(lang_code, {}).items()]
    )
    return f"""You are an expert technical translator.

Your task: translate the markdown passed as a user input from English into {target_language}.
The inputs are the Microsoft 365 Copilot agent building instructions, and your translation outputs will be used for serving the official {target_language} version of the instructions. Thus, accuracy, clarity, and fidelity to the original are critical.

############################
##  OUTPUT REQUIREMENTS  ##
############################
You must return **only** the translated markdown. Do not include any commentary, metadata, or explanations. The original markdown structure must be strictly preserved.

#########################
##  GENERAL RULES      ##
#########################
- Be professional and polite.
- Keep the tone **natural** and concise.
- Do not omit any content. If a segment should stay in English, copy it verbatim.
- Do not change the markdown data structure, including the indentations.
- Section titles starting with # or ## must be a noun form rather than a sentence.
- Section titles must be translated except for the Do-Not-Translate list.
- Keep all placeholders such as `CODE_BLOCK_*` and `CODE_LINE_PREFIX` unchanged.
- Convert asset paths: `./assets/…` → `../assets/…`.  
  *Example:* `![img](./assets/images/pic.png)` → `![img](../assets/images/pic.png)`
- Change the pymdownx.snippets path that begins with `---8<---` syntax from `---8<--- "…"` to `---8<--- "{lang_code}/…"`.
- For files under `docs/includes/`, if you see links within HTML anchor tags, change the href paths `/pages/…` -> `/{lang_code}/pages/…`.
- Treat the **Do‑Not‑Translate list** and **Term‑Specific list** as case‑insensitive; preserve the original casing you see.
- Skip translation for:
  - Inline code surrounded by single back‑ticks ( `like_this` ).
  - Fenced code blocks delimited by ``` or ~~~, including all comments inside them.
  - Link URLs inside `[label](URL)` – translate the label, never the URL.

#########################
##  LANGUAGE‑SPECIFIC  ##
#########################
*(applies only when {target_language} = Japanese)*  
- Insert a half‑width space before and after all alphanumeric terms.  
- Add a half‑width space just outside markdown emphasis markers: ` **太字** ` (good) vs `** 太字 **` (bad).
- You must consistently use polite wording such as です/ます rather than である/なのだ.

#########################
##  DO NOT TRANSLATE   ##
#########################
When replacing the following terms, do not have extra spaces before/after them:
{do_not_translate_terms}

#########################
##  TERM‑SPECIFIC      ##
#########################
Translate these terms exactly as provided (no extra spaces):  
{specific_terms}

#########################
##  IF UNSURE          ##
#########################
If you are uncertain about a term, leave the original English term in parentheses after your translation.

#########################
##  TRACKING LINK      ##
#########################
There is a tracking link to measure the site traffic on each markdown file, except under `docs/includes/`.
If you see a HTML tag begins with `<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/…`, append `--{lang_code}` to the end of the URL like this: `<img src="https://m365-visitor-stats.azurewebsites.net/copilot-camp/make/agent-builder/01-first-agent--ja">`.

#########################
##  WORKFLOW           ##
#########################

Follow the following workflow to translate the given markdown text data:

1. Read the input markdown text given by the user.
2. Translate the markdown file into {target_language}, carefully following the requirements above.
3. Perform a self-review to evaluate the quality of the translation, focusing on naturalness, accuracy, and consistency in detail.
4. If improvements are necessary, refine the content without changing the original meaning.
5. Continue improving the translation until you are fully satisfied with the result.
6. Once the final output is ready, return **only** the translated markdown text. No extra commentary.
"""


# Function to translate and save files
def translate_file(file_path: str, target_path: str, lang_code: str) -> None:
    print(f"Translating {file_path} into a different language: {lang_code}")
    with open(file_path, encoding="utf-8") as f:
        content = f.read()

    # Split content into lines
    lines: list[str] = content.splitlines()
    chunks: list[str] = []
    current_chunk: list[str] = []

    # Split content into chunks of up to 120 lines, ensuring splits occur before section titles
    in_code_block = False
    code_blocks: list[str] = []
    code_block_chunks: list[str] = []
    for line in lines:
        if (
            ENABLE_SMALL_CHUNK_TRANSLATION is True
            and len(current_chunk) >= 120  # required for gpt-4.5
            and not in_code_block
            and line.startswith("#")
        ):
            chunks.append("\n".join(current_chunk))
            current_chunk = []
        if ENABLE_CODE_SNIPPET_EXCLUSION is True and line.strip().startswith("```"):
            code_block_chunks.append(line)
            if in_code_block is True:
                code_blocks.append("\n".join(code_block_chunks))
                current_chunk.append(f"CODE_BLOCK_{(len(code_blocks) - 1):02}")
                code_block_chunks.clear()
            in_code_block = not in_code_block
            continue
        if in_code_block is True:
            code_block_chunks.append(line)
        else:
            current_chunk.append(line)
    if current_chunk:
        chunks.append("\n".join(current_chunk))

    # Translate each chunk separately and combine results
    translated_content: list[str] = []
    for chunk in chunks:
        instructions = built_instructions(languages[lang_code], lang_code)
        response = client.chat.completions.create(
            model=model,
            messages=[
              {"role": "system", "content": instructions},
              {"role": "user", "content": chunk},
            ],
            temperature=1,
        )
        translated_content.append(response.choices[0].message.content)
 

    translated_text = "\n".join(translated_content)
    for idx, code_block in enumerate(code_blocks):
        translated_text = translated_text.replace(f"CODE_BLOCK_{idx:02}", code_block)

    # FIXME: enable mkdocs search plugin to seamlessly work with i18n plugin
    # Only add SEARCH_EXCLUSION if not in an 'includes' folder
    if "includes" not in os.path.normpath(file_path).split(os.sep):
        translated_text = SEARCH_EXCLUSION + translated_text
    # Save the combined translated content
    with open(target_path, "w", encoding="utf-8") as f:
        f.write(translated_text)


def translate_single_source_file(file_path: str) -> None:
    relative_path = os.path.relpath(file_path, source_dir)
    if "ref/" in relative_path or not file_path.endswith(".md"):
        return

    for lang_code in languages:
        # Determine if this is an includes file
        is_includes = "includes" in os.path.normpath(file_path).split(os.sep)
        if is_includes:
            # For includes files, check docs/includes/<lang_code>/
            target_dir = os.path.join(source_dir, "includes", lang_code)
            target_path = os.path.join(target_dir, os.path.basename(file_path))
        else:
            # For regular files, check docs/<lang_code>/
            target_dir = os.path.join(source_dir, lang_code)
            target_path = os.path.join(target_dir, relative_path)

        # Check if target file exists and is up-to-date
        if os.path.exists(target_path):
            src_mtime = os.path.getmtime(file_path)
            tgt_mtime = os.path.getmtime(target_path)
            if tgt_mtime >= src_mtime:
                print(f"Skipping up-to-date file: {target_path}")
                continue

        # Ensure the target directory exists
        os.makedirs(os.path.dirname(target_path), exist_ok=True)

        # Translate and save the file
        translate_file(file_path, target_path, lang_code)


def main():
    # Traverse the source directory
    for root, _, file_names in os.walk(source_dir):
        # Skip the target directories
        if any(lang in root for lang in languages):
            continue
        # Increasing this will make the translation faster; you can decide considering the model's capacity
        concurrency = 6
        with ThreadPoolExecutor(max_workers=concurrency) as executor:
            futures = []
            for file_name in file_names:
                filepath = os.path.join(root, file_name)
                futures.append(executor.submit(translate_single_source_file, filepath))
                if len(futures) >= concurrency:
                    for future in futures:
                        future.result()
                    futures.clear()

    print("Translation completed.")

if __name__ == "__main__":
    # translate_single_source_file("docs/index.md")
    main()