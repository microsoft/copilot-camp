# Lab 02 - Bring your data with Azure AI Search

In this lab you will enable Retrieval-Augmented Generation for your custom engine copilot and integrate with Azure AI Search to chat with your data.

In this lab you will learn:

- What is Retrieval-Augmented Generation (RAG)
- Setup Azure resources
- Upload your documents to Azure AI Search
- Prepare your custom engine copilot for Vector Search
- Learn how to run and test your app

## Introduction

In the previous exercise, you learned how to create a custom engine copilot and customize the prompt for defining the behavior of the AI chatbot, Career Genie. In this exercise, you'll apply vector search to a collection of resumes to find the best candidate for the job requirements. To enable vector search in Career Genie, you'll use the "Azure OpenAI Studio on your data" feature to:

- Create an index on Azure AI Search.
- Generate vector embeddings for the resumes (PDF documents).
- Upload the data in chunks to Azure AI Search.

Finally, you'll integrate your custom engine copilot with Azure AI Search to chat with your data and obtain the best results.

### What is Vector search and why use it?

Vector search is an advanced information retrieval method that indexes and queries content based on numeric representations called vectors. Unlike traditional text-based search, which relies on exact keyword matches, vector search uses these numeric vectors to find content that is similar to the query vector. This enables Vector search to handle:

- **Semantic or conceptual similarity:** Matching concepts that are similar in meaning even if they use different words (e.g., "car" and "automobile").
- **Multilingual content:** Finding equivalent content across different languages (e.g., "car" in English and "voiture" in French).
- **Multiple content types:** Searching across different formats (e.g., "car" in text and an image of a car).

Benefits of using vector search include:

- **Enhanced accuracy:** By focusing on the underlying meaning rather than exact keywords, vector search can return more relevant results.
- **Greater flexibility:** It can handle diverse languages and content types, making it useful for international and multimedia applications.
- **Improved user experience:** Users receive more accurate and contextually appropriate results, enhancing their overall search experience.
- **Scalability:** Vector search can efficiently manage large datasets, making it suitable for applications requiring high performance and scalability.
- **Hybrid capability:** Vector search can be used in combination with semantic and keyword search to leverage the strengths of both approaches, providing a more comprehensive and robust search solution.

## Exercise 1: Setup Azure Resources

You'll need to complete the Azure subscription pre-requisite before starting with this exercise.


### Step 1: Create Azure AI Search service resource

1. Open the browser of your choice and navigate to [Azure Portal](https://portal.azure.com).
1. Select **Create a resource**, then search for `Azure AI Search`. Select the Azure AI Search service and then **Create**.
1. Fill out the following details and select **Review + Create**:
    - **Subscription:** The Azure subscription for your Azure OpenAI Service
    - **Resource group:** Select the pre-existing resource group you created earlier for Azure OpenAI service.
    - **Name:** A descriptive name for your Azure OpenAI Service resource, such as `copilotcamp-ai-search`.
    - **Location:** The location of your instance.
    - **Pricing Tier:** Standard

Once your Azure AI Search service resource is created successfully, navigate to your resource, In **Overview**, copy and save `Url`. Then, navigate to **Keys**, copy and save `Primary admin key`. Both of them will be required later in the following exercises.

### Step 2: Create a storage account service resource

1. Open the browser of your choice and navigate to [Azure Portal](https://portal.azure.com).
1. Select **Create a resource**, then search for `Storage Account`. Select the Storage Account service and then **Create**.
1. Fill out the following details and select **Review**, then **Create**:
    - **Subscription:** The Azure subscription for your Azure OpenAI Service
    - **Resource group:** Select the pre-existing resource group you created earlier for Azure OpenAI service.
    - **Name:** A descriptive name for your Azure OpenAI Service resource, such as `copilotcampstorage`.
    - **Region:** The location of your instance.
    - **Performance:** Standard
    - **Redundancy:** Geo-redundant storage (GRS)

### Step 3: Create a `text-embedding-ada-002` model

??? info "What does `text-embedding-ada-002` do?"
    The `text-embedding-ada-002` model on Azure OpenAI converts text into numeric vectors that represent the meaning of the text. This allows for vector search, where instead of matching exact words, the search finds text with similar meanings. It works with multiple languages and different content types, making it useful for comparing text across languages and formats. When used with Azure AI Search, it improves search results by finding the most relevant and contextually accurate information. This model is perfect for creating advanced search solutions and applications that need to understand natural language.

Open [Azure OpenAI Studio](https://oai.azure.com/portal) in your browser, then select **Deployments**. Select **Create a new deployment**. Fill out the following details and select **Create**:

- **Select a model:** `text-embedding-ada-002`.
- **Model version:** Default.
- **Deployment type:** Standard.
- **Deployment name:** Recommended to use a memorable name, such as `text-embeddings`.
- **Content Filter:** Default.

!!! tip "Tip: Handling no quota available message"
    When you select a model, you may see **No quota available** message pop-up on top of the configuration page. To handle this, you have two options:
    1. Select a different version or deployment type
    1. Free up the resources on other deployments by requesting for [more quota or adjust the existing quota](https://oai.azure.com/portal/96d4a6668daf4335bc1273c1bb46cb4f/quota)

## Exercise 2: Upload your documents to Azure AI Search using Azure OpenAI Studio

For this exercise, download [resumes.zip]() and unzip the folder.

### Step 1: Upload your documents to Azure AI Search

1. Open [Azure OpenAI Studio](https://oai.azure.com/portal) in your browser, then select **Chat** playground. In the **Setup** section, select **Add your data** tab and then **Add a data source**.

    ![Add your data in Azure OpenAI Studio](../../assets/images/custom-engine-02/add-your-data-aoai.png)

1. Select **Upload files (preview)**, then fill the details as the following and select **Next**:

    - **Subscription:** Select the subscription you created your Azure resources.
    - **Select Azure Blob storage resource:** Select your storage resource, `copilotcampstorage`. (You'll see a message *Azure OpenAI needs your permission to access this resource*, select **Turn on CORS**.)
    - **Select Azure AI Search resource:** Select your Azure AI Search resournce, `copilotcamp-ai-search`.
    - **Enter the index name:** Index name, such as `resumes`.
    - Select the box for **Add vector search to this search resource**.
    - **Select an embedding model:** Select your text-embedding-ada-002 model, `text-embeddings`.

    ![Upload your data source](../../assets/images/custom-engine-02/add-data-source-aoai.png)

1. Select **Browse for a file** and select the pdf documents from the `resumes` folder. Then, select **Upload files** and **Next**.
1. Select Search type as `Vector` and chunk size as `1024(Default)`, then **Next**.
1. Select `API Key` as Azure resource authentication type, then **Next**.

### Step 2: Test your data on Azure OpenAI Studio

Once your data  ingestion is completed, use Chat playground to ask questions about your data.

!!! tip "Tip: Making the most out of your data"
    Review your dataset before asking questions testing the vector search. Go through the `resumes` folder and recognize the resumes provided in different languages with diverse professions, years of experience, skills and more. Start chatting with your data by asking questions to find out the right candidate for a skill, language, profession, years of experience and other categories. Try to test out the combination of requirements to challenge the search experience!

![Chat with your data on Azure OpenAI Studio](../../assets/images/custom-engine-02/chat-with-your-data-aoai.png)

### Step 3: Sneak peek to your index on Azure AI Search

To understand more about your dataset and explore more, select **resumes** from the Add your data section of the Chat playground. This will redirect you to your resumes index on Azure AI Search.

![Index on Azure AI Search](../../assets/images/custom-engine-02/index-aoai.png)

First, let's include the vector content in our data. Select **Fields** tab in your Resumes index page, then check the box for **contentVector**, finally select **Save**.

![Include contentVector](../../assets/images/custom-engine-02/add-contentvector.png)

Go back to **Search explorer** tab, select **Query options** in your Resumes index page and then change the **API version** as `2023-11-01`, then select **Close**. To view your data, press **Search**.

!!! tip "Tip: Numeric vectors for each pdf document"
    When scrolling through your data, recognize that each document has `contentVector` parameter that contains the numeric vectors of the pdf document. These numeric vectors will be used for Vector Search to identify the best matching results.

![contentVector in data](../../assets/images/custom-engine-02/contentvector-in-your-data.png)

## Exercise 3: Integrate your app with Azure AI Search

For this exercise, ensure that you obtain Azure OpenAI text embedding deployment name and Azure AI Search key and endpoint.

### Step 1: Configure environment variables

1. In your Career Genie project, navigate to `env/.env.local.user` and paste the following environment variables:

    ```json
    AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME='<Your-Text-Embedding-Model-Name>'
    SECRET_AZURE_SEARCH_KEY='<Your-Azure-AI-Search-Key>'
    AZURE_SEARCH_ENDPOINT='<Your-Azure-AI-Search-Endpoint>'
    ```

1. Open `teamsapp.local.yml` and add the following snippet at the bottom of the file, under `uses: file/createOrUpdateEnvironmentFile`:

    ```yml
    AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME: ${{AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME}}
    AZURE_SEARCH_KEY: ${{SECRET_AZURE_SEARCH_KEY}}
    AZURE_SEARCH_ENDPOINT: ${{AZURE_SEARCH_ENDPOINT}}
    ```

1. Navigate to `src/config.ts` and add the following snippet inside `config`:

    ```typescript
    azureOpenAIEmbeddingDeploymentName: process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME,
    azureSearchKey: process.env.AZURE_SEARCH_KEY,
    azureSearchEndpoint: process.env.AZURE_SEARCH_ENDPOINT
    ```

### Step 2: Configure Azure AI Search in your source code

1. Open `src/prompts/chat/config.json` in your project, then add the following property inside your prompt configuration:

    ```json
      "augmentation": {
        "data_sources": {
            "azure-ai-search": 1200
        }
      }
    ```

1. Open `src/prompts/chat/skprompt.txt` and add the following line in your prompt:

    ```
    Use the context provided in the `<context></context>` tags as the source for your answers.
    ```

1. Open the terminal from the project root, then run the following command:

    ```node
    npm install @azure/search-documents
    ```
    
1. Create a new file named `azureAISearchDataSource.ts` under `src/app` folder and copy the following code snippet inside this file:

    ```typescript
    import { DataSource, Memory, OpenAIEmbeddings, RenderedPromptSection, Tokenizer } from "@microsoft/teams-ai";
    import { TurnContext } from "botbuilder";
    import { AzureKeyCredential, SearchClient } from "@azure/search-documents";
    
    /**
     * Defines the Document Interface.
     */
    export interface MyDocument {
        id?: string;
        title?: string | null;
        content?: string | null;
        filepath?: string | null;
        url?: string | null;
        contentVector?: number[] | null;
    }
    
    /**
     * Options for creating a `AzureAISearchDataSource`.
     */
    export interface AzureAISearchDataSourceOptions {
        name: string;
        indexName: string;
        azureOpenAIApiKey: string;
        azureOpenAIEndpoint: string;
        azureOpenAIEmbeddingDeploymentName: string;
        azureAISearchApiKey: string;
        azureAISearchEndpoint: string;
    }
    
    export class AzureAISearchDataSource implements DataSource {
        public readonly name: string;
        private readonly options: AzureAISearchDataSourceOptions;
        private readonly searchClient: SearchClient<MyDocument>;
    
        /**
         * Creates a new `AzureAISearchDataSource` instance.
         * @param {AzureAISearchDataSourceOptions} options Options for creating the data source.
         */
        public constructor(options: AzureAISearchDataSourceOptions) {
            this.name = options.name;
            this.options = options;
            this.searchClient = new SearchClient<MyDocument>(
                options.azureAISearchEndpoint,
                options.indexName,
                new AzureKeyCredential(options.azureAISearchApiKey),
                {}
            );
        }
    
        /**
         * Renders the data source as a string of text.
         * @remarks
         * The returned output should be a string of text that will be injected into the prompt at render time.
         * @param context Turn context for the current turn of conversation with the user.
         * @param memory An interface for accessing state values.
         * @param tokenizer Tokenizer to use when rendering the data source.
         * @param maxTokens Maximum number of tokens allowed to be rendered.
         * @returns A promise that resolves to the rendered data source.
         */
        public async renderData(context: TurnContext, memory: Memory, tokenizer: Tokenizer, maxTokens: number): Promise<RenderedPromptSection<string>> {
            const query = memory.getValue("temp.input") as string;
            if(!query) {
                return { output: "", length: 0, tooLong: false };
            }
            
            const selectedFields = [
                "id",
                "title",
                "content",
            ];
    
            // hybrid search
            const queryVector: number[] = await this.getEmbeddingVector(query);
            const searchResults = await this.searchClient.search(query, {
                searchFields: ["title", "content"],
                select: selectedFields as any,
                vectorSearchOptions: {
                    queries: [
                        {
                            kind: "vector",
                            fields: ["contentVector"],
                            kNearestNeighborsCount: 2,
                            // The query vector is the embedding of the user's input
                            vector: queryVector
                        }
                    ]
                },
            });
    
            if (!searchResults.results) {
                return { output: "", length: 0, tooLong: false };
            }
    
            let usedTokens = 0;
            let doc = "";
            for await (const result of searchResults.results) {
                const formattedResult = this.formatDocument(result.document.content);
                const tokens = tokenizer.encode(formattedResult).length;
    
                if (usedTokens + tokens > maxTokens) {
                    break;
                }
    
                doc += formattedResult;
                usedTokens += tokens;
            }
    
            return { output: doc, length: usedTokens, tooLong: usedTokens > maxTokens };
        }
    
        /**
         * Formats the result string 
         * @param result 
         * @returns 
         */
        private formatDocument(result: string): string {
            return `<context>${result}</context>`;
        }
    
        /**
         * Generate embeddings for the user's input.
         * @param {string} text - The user's input.
         * @returns {Promise<number[]>} The embedding vector for the user's input.
         */
        private async getEmbeddingVector(text: string): Promise<number[]> {
            const embeddings = new OpenAIEmbeddings({
                azureApiKey: this.options.azureOpenAIApiKey,
                azureEndpoint: this.options.azureOpenAIEndpoint,
                azureDeployment: this.options.azureOpenAIEmbeddingDeploymentName,
            });
    
            const result = await embeddings.createEmbeddings(this.options.azureOpenAIEmbeddingDeploymentName, text);
    
            if (result.status !== "success" || !result.output) {
                throw new Error(`Failed to generate embeddings for description: ${text}`);
            }
    
            return result.output[0];
        }
    }
    ```

1. Open `src/app/app.ts` and add the following code snippet right after the planner:

    ```typescript
    // Register your data source with planner
    planner.prompts.addDataSource(
      new AzureAISearchDataSource({
        name: "azure-ai-search",
        indexName: "resumes",
        azureAISearchApiKey: config.azureSearchKey!,
        azureAISearchEndpoint: config.azureSearchEndpoint!,
        azureOpenAIApiKey: config.azureOpenAIKey!,
        azureOpenAIEndpoint: config.azureOpenAIEndpoint!,
        azureOpenAIEmbeddingDeploymentName: config.azureOpenAIEmbeddingDeploymentName!
      })
    );
    ```

### Step 3: Debug your app and chat with your data

Let's test Career Genie on Teams this time. Start debugging your app by selecting **Run and Debug** tab on Visual Studio Code and **Debug in Teams (Edge)** or **Debug in Teams (Chrome)**. Microsoft Teams will pop up on your browser. Once your app details show up on Teams, select **Add** and start chatting with your app.

!!! tip "Tip: Asking questions about your data"
    Ensure your questions are related to your dataset. Go through pdf documents in the `resumes` folder to understand more about your data. Challenge your custom engine copilot by combining requirements and asking complex questions!

![Chat with your data on Teams](../../assets/images/custom-engine-02/byod-teams.gif)