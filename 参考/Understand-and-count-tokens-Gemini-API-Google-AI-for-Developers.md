Gemini and other generative AI models process input and output at a granularity called a _token_.

## About tokens

Tokens can be single characters like `z` or whole words like `cat`. Long words are broken up into several tokens. The set of all tokens used by the model is called the vocabulary, and the process of splitting text into tokens is called _tokenization_.

For Gemini models, a token is equivalent to about 4 characters. 100 tokens is equal to about 60-80 English words.

When billing is enabled, the [cost of a call to the Gemini API](https://ai.google.dev/pricing) is determined in part by the number of input and output tokens, so knowing how to count tokens can be helpful.

## Count tokens

All input to and output from the Gemini API is tokenized, including text, image files, and other non-text modalities.

You can count tokens in the following ways:

-   **Call [`countTokens`](https://ai.google.dev/api/rest/v1/models/countTokens) with the input of the request.**  
    This returns the total number of tokens in _the input only_. You can make this call before sending the input to the model to check the size of your requests.
    
-   **Use the `usageMetadata` attribute on the `response` object after calling `generate_content`.**  
    This returns the total number of tokens in _both the input and the output_: `totalTokenCount`.  
    It also returns the token counts of the input and output separately: `promptTokenCount` (input tokens) and `candidatesTokenCount` (output tokens).
    

### Count text tokens

If you call `countTokens` with a text-only input, it returns the token count of the text in _the input only_ (`totalTokens`). You can make this call before calling `generateContent` to check the size of your requests.

Another option is calling `generateContent` and then using the `usageMetadata` attribute on the `response` object to get the following:

-   The separate token counts of the input (`promptTokenCount`) and the output (`candidatesTokenCount`)
-   The total number of tokens in _both the input and the output_ (`totalTokenCount`)

```
<span>// Make sure to include the following import:</span>
<span>// import {GoogleGenAI} from '@google/genai';</span>
<span>const</span><span> </span><span>ai</span><span> </span><span>=</span><span> </span><span>new</span><span> </span><span>GoogleGenAI</span><span>({</span><span> </span><span>apiKey</span><span>:</span><span> </span><span>process</span><span>.</span><span>env</span><span>.</span><span>GEMINI_API_KEY</span><span> </span><span>});</span>
<span>const</span><span> </span><span>prompt</span><span> </span><span>=</span><span> </span><span>"The quick brown fox jumps over the lazy dog."</span><span>;</span>
<span>const</span><span> </span><span>countTokensResponse</span><span> </span><span>=</span><span> </span><span>await</span><span> </span><span>ai</span><span>.</span><span>models</span><span>.</span><span>countTokens</span><span>({</span>
<span>  </span><span>model</span><span>:</span><span> </span><span>"gemini-2.0-flash"</span><span>,</span>
<span>  </span><span>contents</span><span>:</span><span> </span><span>prompt</span><span>,</span>
<span>});</span>
<span>console</span><span>.</span><span>log</span><span>(</span><span>countTokensResponse</span><span>.</span><span>totalTokens</span><span>);</span>

<span>const</span><span> </span><span>generateResponse</span><span> </span><span>=</span><span> </span><span>await</span><span> </span><span>ai</span><span>.</span><span>models</span><span>.</span><span>generateContent</span><span>({</span>
<span>  </span><span>model</span><span>:</span><span> </span><span>"gemini-2.0-flash"</span><span>,</span>
<span>  </span><span>contents</span><span>:</span><span> </span><span>prompt</span><span>,</span>
<span>});</span>
<span>console</span><span>.</span><span>log</span><span>(</span><span>generateResponse</span><span>.</span><span>usageMetadata</span><span>);</span><div><p><a target="_top" href="https://github.com/google-gemini/api-examples/blob/16520aea9a9f109d1f616ba3400e87c1ece94cac/javascript/count_tokens.js#L38-L52" data-category="github_link" data-label="google-gemini/api-examples/javascript/count_tokens.js#tokens_text_only" data-code-snippet="true" data-github-path="google-gemini/api-examples/javascript/count_tokens.js" data-region-tag="tokens_text_only"><span>count_tokens</span><span>.</span><span>js</span></a></p></div>
```

### Count multi-turn (chat) tokens

If you call `countTokens` with the chat history, it returns the total token count of the text from each role in the chat (`totalTokens`).

Another option is calling `sendMessage` and then using the `usageMetadata` attribute on the `response` object to get the following:

-   The separate token counts of the input (`promptTokenCount`) and the output (`candidatesTokenCount`)
-   The total number of tokens in _both the input and the output_ (`totalTokenCount`)

To understand how big your next conversational turn will be, you need to append it to the history when you call `countTokens`.

```
<span>// Make sure to include the following import:</span>
<span>// import {GoogleGenAI} from '@google/genai';</span>
<span>const</span><span> </span><span>ai</span><span> </span><span>=</span><span> </span><span>new</span><span> </span><span>GoogleGenAI</span><span>({</span><span> </span><span>apiKey</span><span>:</span><span> </span><span>process</span><span>.</span><span>env</span><span>.</span><span>GEMINI_API_KEY</span><span> </span><span>});</span>
<span>// Initial chat history.</span>
<span>const</span><span> </span><span>history</span><span> </span><span>=</span><span> </span><span>[</span>
<span>  </span><span>{</span><span> </span><span>role</span><span>:</span><span> </span><span>"user"</span><span>,</span><span> </span><span>parts</span><span>:</span><span> </span><span>[{</span><span> </span><span>text</span><span>:</span><span> </span><span>"Hi my name is Bob"</span><span> </span><span>}]</span><span> </span><span>},</span>
<span>  </span><span>{</span><span> </span><span>role</span><span>:</span><span> </span><span>"model"</span><span>,</span><span> </span><span>parts</span><span>:</span><span> </span><span>[{</span><span> </span><span>text</span><span>:</span><span> </span><span>"Hi Bob!"</span><span> </span><span>}]</span><span> </span><span>},</span>
<span>];</span>
<span>const</span><span> </span><span>chat</span><span> </span><span>=</span><span> </span><span>ai</span><span>.</span><span>chats</span><span>.</span><span>create</span><span>({</span>
<span>  </span><span>model</span><span>:</span><span> </span><span>"gemini-2.0-flash"</span><span>,</span>
<span>  </span><span>history</span><span>:</span><span> </span><span>history</span><span>,</span>
<span>});</span>

<span>// Count tokens for the current chat history.</span>
<span>const</span><span> </span><span>countTokensResponse</span><span> </span><span>=</span><span> </span><span>await</span><span> </span><span>ai</span><span>.</span><span>models</span><span>.</span><span>countTokens</span><span>({</span>
<span>  </span><span>model</span><span>:</span><span> </span><span>"gemini-2.0-flash"</span><span>,</span>
<span>  </span><span>contents</span><span>:</span><span> </span><span>chat</span><span>.</span><span>getHistory</span><span>(),</span>
<span>});</span>
<span>console</span><span>.</span><span>log</span><span>(</span><span>countTokensResponse</span><span>.</span><span>totalTokens</span><span>);</span>

<span>const</span><span> </span><span>chatResponse</span><span> </span><span>=</span><span> </span><span>await</span><span> </span><span>chat</span><span>.</span><span>sendMessage</span><span>({</span>
<span>  </span><span>message</span><span>:</span><span> </span><span>"In one sentence, explain how a computer works to a young child."</span><span>,</span>
<span>});</span>
<span>console</span><span>.</span><span>log</span><span>(</span><span>chatResponse</span><span>.</span><span>usageMetadata</span><span>);</span>

<span>// Add an extra user message to the history.</span>
<span>const</span><span> </span><span>extraMessage</span><span> </span><span>=</span><span> </span><span>{</span>
<span>  </span><span>role</span><span>:</span><span> </span><span>"user"</span><span>,</span>
<span>  </span><span>parts</span><span>:</span><span> </span><span>[{</span><span> </span><span>text</span><span>:</span><span> </span><span>"What is the meaning of life?"</span><span> </span><span>}],</span>
<span>};</span>
<span>const</span><span> </span><span>combinedHistory</span><span> </span><span>=</span><span> </span><span>chat</span><span>.</span><span>getHistory</span><span>();</span>
<span>combinedHistory</span><span>.</span><span>push</span><span>(</span><span>extraMessage</span><span>);</span>
<span>const</span><span> </span><span>combinedCountTokensResponse</span><span> </span><span>=</span><span> </span><span>await</span><span> </span><span>ai</span><span>.</span><span>models</span><span>.</span><span>countTokens</span><span>({</span>
<span>  </span><span>model</span><span>:</span><span> </span><span>"gemini-2.0-flash"</span><span>,</span>
<span>  </span><span>contents</span><span>:</span><span> </span><span>combinedHistory</span><span>,</span>
<span>});</span>
<span>console</span><span>.</span><span>log</span><span>(</span>
<span>  </span><span>"Combined history token count:"</span><span>,</span>
<span>  </span><span>combinedCountTokensResponse</span><span>.</span><span>totalTokens</span><span>,</span>
<span>);</span><div><p><a target="_top" href="https://github.com/google-gemini/api-examples/blob/16520aea9a9f109d1f616ba3400e87c1ece94cac/javascript/count_tokens.js#L62-L101" data-category="github_link" data-label="google-gemini/api-examples/javascript/count_tokens.js#tokens_chat" data-code-snippet="true" data-github-path="google-gemini/api-examples/javascript/count_tokens.js" data-region-tag="tokens_chat"><span>count_tokens</span><span>.</span><span>js</span></a></p></div>
```

### Count multimodal tokens

All input to the Gemini API is tokenized, including text, image files, and other non-text modalities. Note the following high-level key points about tokenization of multimodal input during processing by the Gemini API:

-   With Gemini 2.0, image inputs with both dimensions <=384 pixels are counted as 258 tokens. Images larger in one or both dimensions are cropped and scaled as needed into tiles of 768x768 pixels, each counted as 258 tokens. Prior to Gemini 2.0, images used a fixed 258 tokens.
    
-   Video and audio files are converted to tokens at the following fixed rates: video at 263 tokens per second and audio at 32 tokens per second.
    

#### Image files

If you call `countTokens` with a text-and-image input, it returns the combined token count of the text and the image in _the input only_ (`totalTokens`). You can make this call before calling `generateContent` to check the size of your requests. You can also optionally call `countTokens` on the text and the file separately.

Another option is calling `generateContent` and then using the `usageMetadata` attribute on the `response` object to get the following:

-   The separate token counts of the input (`promptTokenCount`) and the output (`candidatesTokenCount`)
-   The total number of tokens in _both the input and the output_ (`totalTokenCount`)

Example that uses an uploaded image from the File API:

```
<span>// Make sure to include the following import:</span>
<span>// import {GoogleGenAI} from '@google/genai';</span>
<span>const</span><span> </span><span>ai</span><span> </span><span>=</span><span> </span><span>new</span><span> </span><span>GoogleGenAI</span><span>({</span><span> </span><span>apiKey</span><span>:</span><span> </span><span>process</span><span>.</span><span>env</span><span>.</span><span>GEMINI_API_KEY</span><span> </span><span>});</span>
<span>const</span><span> </span><span>prompt</span><span> </span><span>=</span><span> </span><span>"Tell me about this image"</span><span>;</span>
<span>const</span><span> </span><span>organ</span><span> </span><span>=</span><span> </span><span>await</span><span> </span><span>ai</span><span>.</span><span>files</span><span>.</span><span>upload</span><span>({</span>
<span>  </span><span>file</span><span>:</span><span> </span><span>path</span><span>.</span><span>join</span><span>(</span><span>media</span><span>,</span><span> </span><span>"organ.jpg"</span><span>),</span>
<span>  </span><span>config</span><span>:</span><span> </span><span>{</span><span> </span><span>mimeType</span><span>:</span><span> </span><span>"image/jpeg"</span><span> </span><span>},</span>
<span>});</span>

<span>const</span><span> </span><span>countTokensResponse</span><span> </span><span>=</span><span> </span><span>await</span><span> </span><span>ai</span><span>.</span><span>models</span><span>.</span><span>countTokens</span><span>({</span>
<span>  </span><span>model</span><span>:</span><span> </span><span>"gemini-2.0-flash"</span><span>,</span>
<span>  </span><span>contents</span><span>:</span><span> </span><span>createUserContent</span><span>([</span>
<span>    </span><span>prompt</span><span>,</span>
<span>    </span><span>createPartFromUri</span><span>(</span><span>organ</span><span>.</span><span>uri</span><span>,</span><span> </span><span>organ</span><span>.</span><span>mimeType</span><span>),</span>
<span>  </span><span>]),</span>
<span>});</span>
<span>console</span><span>.</span><span>log</span><span>(</span><span>countTokensResponse</span><span>.</span><span>totalTokens</span><span>);</span>

<span>const</span><span> </span><span>generateResponse</span><span> </span><span>=</span><span> </span><span>await</span><span> </span><span>ai</span><span>.</span><span>models</span><span>.</span><span>generateContent</span><span>({</span>
<span>  </span><span>model</span><span>:</span><span> </span><span>"gemini-2.0-flash"</span><span>,</span>
<span>  </span><span>contents</span><span>:</span><span> </span><span>createUserContent</span><span>([</span>
<span>    </span><span>prompt</span><span>,</span>
<span>    </span><span>createPartFromUri</span><span>(</span><span>organ</span><span>.</span><span>uri</span><span>,</span><span> </span><span>organ</span><span>.</span><span>mimeType</span><span>),</span>
<span>  </span><span>]),</span>
<span>});</span>
<span>console</span><span>.</span><span>log</span><span>(</span><span>generateResponse</span><span>.</span><span>usageMetadata</span><span>);</span><div><p><a target="_top" href="https://github.com/google-gemini/api-examples/blob/16520aea9a9f109d1f616ba3400e87c1ece94cac/javascript/count_tokens.js#L148-L173" data-category="github_link" data-label="google-gemini/api-examples/javascript/count_tokens.js#tokens_multimodal_image_file_api" data-code-snippet="true" data-github-path="google-gemini/api-examples/javascript/count_tokens.js" data-region-tag="tokens_multimodal_image_file_api"><span>count_tokens</span><span>.</span><span>js</span></a></p></div>
```

Example that provides the image as inline data:

```
<span>// Make sure to include the following import:</span>
<span>// import {GoogleGenAI} from '@google/genai';</span>
<span>const</span><span> </span><span>ai</span><span> </span><span>=</span><span> </span><span>new</span><span> </span><span>GoogleGenAI</span><span>({</span><span> </span><span>apiKey</span><span>:</span><span> </span><span>process</span><span>.</span><span>env</span><span>.</span><span>GEMINI_API_KEY</span><span> </span><span>});</span>
<span>const</span><span> </span><span>prompt</span><span> </span><span>=</span><span> </span><span>"Tell me about this image"</span><span>;</span>
<span>const</span><span> </span><span>imageBuffer</span><span> </span><span>=</span><span> </span><span>fs</span><span>.</span><span>readFileSync</span><span>(</span><span>path</span><span>.</span><span>join</span><span>(</span><span>media</span><span>,</span><span> </span><span>"organ.jpg"</span><span>));</span>

<span>// Convert buffer to base64 string.</span>
<span>const</span><span> </span><span>imageBase64</span><span> </span><span>=</span><span> </span><span>imageBuffer</span><span>.</span><span>toString</span><span>(</span><span>"base64"</span><span>);</span>

<span>// Build contents using createUserContent and createPartFromBase64.</span>
<span>const</span><span> </span><span>contents</span><span> </span><span>=</span><span> </span><span>createUserContent</span><span>([</span>
<span>  </span><span>prompt</span><span>,</span>
<span>  </span><span>createPartFromBase64</span><span>(</span><span>imageBase64</span><span>,</span><span> </span><span>"image/jpeg"</span><span>),</span>
<span>]);</span>

<span>const</span><span> </span><span>countTokensResponse</span><span> </span><span>=</span><span> </span><span>await</span><span> </span><span>ai</span><span>.</span><span>models</span><span>.</span><span>countTokens</span><span>({</span>
<span>  </span><span>model</span><span>:</span><span> </span><span>"gemini-2.0-flash"</span><span>,</span>
<span>  </span><span>contents</span><span>:</span><span> </span><span>contents</span><span>,</span>
<span>});</span>
<span>console</span><span>.</span><span>log</span><span>(</span><span>countTokensResponse</span><span>.</span><span>totalTokens</span><span>);</span>

<span>const</span><span> </span><span>generateResponse</span><span> </span><span>=</span><span> </span><span>await</span><span> </span><span>ai</span><span>.</span><span>models</span><span>.</span><span>generateContent</span><span>({</span>
<span>  </span><span>model</span><span>:</span><span> </span><span>"gemini-2.0-flash"</span><span>,</span>
<span>  </span><span>contents</span><span>:</span><span> </span><span>contents</span><span>,</span>
<span>});</span>
<span>console</span><span>.</span><span>log</span><span>(</span><span>generateResponse</span><span>.</span><span>usageMetadata</span><span>);</span><div><p><a target="_top" href="https://github.com/google-gemini/api-examples/blob/16520aea9a9f109d1f616ba3400e87c1ece94cac/javascript/count_tokens.js#L112-L137" data-category="github_link" data-label="google-gemini/api-examples/javascript/count_tokens.js#tokens_multimodal_image_inline" data-code-snippet="true" data-github-path="google-gemini/api-examples/javascript/count_tokens.js" data-region-tag="tokens_multimodal_image_inline"><span>count_tokens</span><span>.</span><span>js</span></a></p></div>
```

#### Video or audio files

Audio and video are each converted to tokens at the following fixed rates:

-   Video: 263 tokens per second
-   Audio: 32 tokens per second

If you call `countTokens` with a text-and-video/audio input, it returns the combined token count of the text and the video/audio file in _the input only_ (`totalTokens`). You can make this call before calling `generateContent` to check the size of your requests. You can also optionally call `countTokens` on the text and the file separately.

Another option is calling `generateContent` and then using the `usageMetadata` attribute on the `response` object to get the following:

-   The separate token counts of the input (`promptTokenCount`) and the output (`candidatesTokenCount`)
-   The total number of tokens in _both the input and the output_ (`totalTokenCount`)

```
<span>// Make sure to include the following import:</span>
<span>// import {GoogleGenAI} from '@google/genai';</span>
<span>const</span><span> </span><span>ai</span><span> </span><span>=</span><span> </span><span>new</span><span> </span><span>GoogleGenAI</span><span>({</span><span> </span><span>apiKey</span><span>:</span><span> </span><span>process</span><span>.</span><span>env</span><span>.</span><span>GEMINI_API_KEY</span><span> </span><span>});</span>
<span>const</span><span> </span><span>prompt</span><span> </span><span>=</span><span> </span><span>"Tell me about this video"</span><span>;</span>
<span>let</span><span> </span><span>videoFile</span><span> </span><span>=</span><span> </span><span>await</span><span> </span><span>ai</span><span>.</span><span>files</span><span>.</span><span>upload</span><span>({</span>
<span>  </span><span>file</span><span>:</span><span> </span><span>path</span><span>.</span><span>join</span><span>(</span><span>media</span><span>,</span><span> </span><span>"Big_Buck_Bunny.mp4"</span><span>),</span>
<span>  </span><span>config</span><span>:</span><span> </span><span>{</span><span> </span><span>mimeType</span><span>:</span><span> </span><span>"video/mp4"</span><span> </span><span>},</span>
<span>});</span>

<span>// Poll until the video file is completely processed (state becomes ACTIVE).</span>
<span>while</span><span> </span><span>(</span><span>!</span><span>videoFile</span><span>.</span><span>state</span><span> </span><span>||</span><span> </span><span>videoFile</span><span>.</span><span>state</span><span>.</span><span>toString</span><span>()</span><span> </span><span>!==</span><span> </span><span>"ACTIVE"</span><span>)</span><span> </span><span>{</span>
<span>  </span><span>console</span><span>.</span><span>log</span><span>(</span><span>"Processing video..."</span><span>);</span>
<span>  </span><span>console</span><span>.</span><span>log</span><span>(</span><span>"File state: "</span><span>,</span><span> </span><span>videoFile</span><span>.</span><span>state</span><span>);</span>
<span>  </span><span>await</span><span> </span><span>sleep</span><span>(</span><span>5000</span><span>);</span>
<span>  </span><span>videoFile</span><span> </span><span>=</span><span> </span><span>await</span><span> </span><span>ai</span><span>.</span><span>files</span><span>.</span><span>get</span><span>({</span><span> </span><span>name</span><span>:</span><span> </span><span>videoFile</span><span>.</span><span>name</span><span> </span><span>});</span>
<span>}</span>

<span>const</span><span> </span><span>countTokensResponse</span><span> </span><span>=</span><span> </span><span>await</span><span> </span><span>ai</span><span>.</span><span>models</span><span>.</span><span>countTokens</span><span>({</span>
<span>  </span><span>model</span><span>:</span><span> </span><span>"gemini-2.0-flash"</span><span>,</span>
<span>  </span><span>contents</span><span>:</span><span> </span><span>createUserContent</span><span>([</span>
<span>    </span><span>prompt</span><span>,</span>
<span>    </span><span>createPartFromUri</span><span>(</span><span>videoFile</span><span>.</span><span>uri</span><span>,</span><span> </span><span>videoFile</span><span>.</span><span>mimeType</span><span>),</span>
<span>  </span><span>]),</span>
<span>});</span>
<span>console</span><span>.</span><span>log</span><span>(</span><span>countTokensResponse</span><span>.</span><span>totalTokens</span><span>);</span>

<span>const</span><span> </span><span>generateResponse</span><span> </span><span>=</span><span> </span><span>await</span><span> </span><span>ai</span><span>.</span><span>models</span><span>.</span><span>generateContent</span><span>({</span>
<span>  </span><span>model</span><span>:</span><span> </span><span>"gemini-2.0-flash"</span><span>,</span>
<span>  </span><span>contents</span><span>:</span><span> </span><span>createUserContent</span><span>([</span>
<span>    </span><span>prompt</span><span>,</span>
<span>    </span><span>createPartFromUri</span><span>(</span><span>videoFile</span><span>.</span><span>uri</span><span>,</span><span> </span><span>videoFile</span><span>.</span><span>mimeType</span><span>),</span>
<span>  </span><span>]),</span>
<span>});</span>
<span>console</span><span>.</span><span>log</span><span>(</span><span>generateResponse</span><span>.</span><span>usageMetadata</span><span>);</span><div><p><a target="_top" href="https://github.com/google-gemini/api-examples/blob/16520aea9a9f109d1f616ba3400e87c1ece94cac/javascript/count_tokens.js#L183-L216" data-category="github_link" data-label="google-gemini/api-examples/javascript/count_tokens.js#tokens_multimodal_video_audio_file_api" data-code-snippet="true" data-github-path="google-gemini/api-examples/javascript/count_tokens.js" data-region-tag="tokens_multimodal_video_audio_file_api"><span>count_tokens</span><span>.</span><span>js</span></a></p></div>
```

### System instructions and tools

System instructions and tools also count towards the total token count for the input.

If you use system instructions, the `totalTokens` count increases to reflect the addition of `systemInstruction`.

If you use function calling, the `totalTokens` count increases to reflect the addition of `tools`.