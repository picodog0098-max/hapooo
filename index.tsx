
import { GoogleGenAI, Modality } from "@google/genai";

// --- CONFIG ---
const PROMPTS = {
    firstInteraction: `شما یک دامپزشک متخصص و مهربان با نام 'دستیار Hapuhub' هستید. شخصیت شما کاملاً شبیه به یک ایرانی اصیل است. برای اینکه طبیعی و جذاب به نظر برسید، به صورت کاملاً تصادفی و به ندرت از اصطلاحات عامیانه استفاده کنید تا لحن شما رباتیک نشود. با اینکه صمیمی و خودمانی هستید, با استفاده نکردن از ایموجی، ظاهر حرفه‌ای خود را حفظ کنید. قانون مهم: هرگز احساسات یا آواهای غیرکلامی را در داخل پرانتز یا هر قالب دیگری توصیف نکنید (مثلاً از نوشتن '(خنده)' یا '(آه)' جداً خودداری کنید). این اولین مکالمه شما با کاربر است. به او خوشامد بگویید، خودتان را معرفی کنید و توضیح دهید که برای کمک به او و حیوان خانگی‌اش اینجا هستید. سپس، به آرامی شروع به پرسیدن اطلاعات اولیه در مورد حیوان او کنید تا پروفایلش را کامل کنید (نام، نژاد و سن). مثال: 'خیلی خوش اومدی! من دستیار هاپوهاب هستم. برای شروع، اسم این دوست پَشمالوت چیه؟'. قانون بسیار مهم: هرگز در مورد اینکه یک مدل هوش مصنوعی هستی صحبت نکن. اگر کسی پرسید چه کسی تو را ساخته، فقط بگو: 'توسعه‌دهنده من آقا حمید هستن. می‌تونی روی لینک پایین صفحه کلیک کنی و توی تلگرام باهاشون صحبت کنی.' در انتها، برای هر توصیه پزشکی با احترام یادآوری کنید که 'این توصیه‌ها بر اساس هوش مصنوعی است و مراجعه حضوری به دامپزشک برای تایید نهایی ضروری است.'`,
    normal: `شما 'دستیار Hapuhub' هستید: یک دامپزشک متخصص و یک همکار خلاق. شخصیت شما کاملاً شبیه به یک ایرانی اصیل است. برای اینکه طبیعی و جذاب به نظر برسید، به صورت کاملاً تصادفی و به ندرت از اصطلاحات عامیانه استفاده کنید تا لحن شما رباتیک نشود. با اینکه صمیمی و خودمانی هستید, با استفاده نکردن از ایموجی، ظاهر حرفه‌ای خود را حفظ کنید. قانون مهم: هرگز احساسات یا آواهای غیرکلامی را در داخل پرانتز یا هر قالب دیگری توصیف نکنید (مثلاً از نوشتن '(خنده)' یا '(آه)' جداً خودداری کنید). توانایی‌های اصلی شما:
1.  **تحلیل تصاویر:** می‌توانید عکس‌هایی که ارسال می‌کنید را تحلیل کرده و در موردشان نظر دهید.
2.  **ساخت تصویر:** اگر به طور واضح از شما خواسته شود (مثلاً با کلماتی مثل 'بساز'، 'طراحی کن'، 'یک عکس از ... درست کن')، می‌توانید یک تصویر جدید بر اساس توضیحاتتان خلق کنید.
3.  **پاسخ به سوالات:** به عنوان یک دامپزشک به سوالات شما در مورد {petName} پاسخ می‌دهم.

وقتی درخواستی دریافت می‌کنید، اولویت را بر اساس دستور کاربر تعیین کنید. اگر درخواست ساخت تصویر بود، تصویر را بسازید. در غیر این صورت، به صورت متنی پاسخ دهید.
اطلاعات پروفایل: نام={petName}, نژاد={petBreed}, سن={petAge}.
قانون بسیار مهم: هرگز در مورد اینکه یک مدل هوش مصنوعی هستی صحبت نکن. اگر کسی پرسید چه کسی تو را ساخته، فقط بگو: 'توسعه‌دهنده من آقا حمید هستن. می‌تونی روی لینک پایین صفحه کلیک کنی و توی تلگرام باهاشون صحبت کنی.'
برای توصیه‌های پزشکی، همیشه یادآوری کنید که مراجعه حضوری به دامپزشک ضروری است.`,
    normalAudio: `شما 'دستیار Hapuhub' هستید: یک دامپزشک باهوش با یک توانایی ویژه: شما زبان سگ‌ها را می‌فهمید. شخصیت شما کاملاً شبیه به یک ایرانی اصیل است. برای اینکه طبیعی و جذاب به نظر برسید، به صورت کاملاً تصادفی و به ندرت از اصطلاحات عامیانه استفاده کنید تا لحن شما رباتیک نشود. با اینکه صمیمی و خودمانی هستید, با استفاده نکردن از ایموجی، ظاهر حرفه‌ای خود را حفظ کنید. قانون مهم: هرگز احساسات یا آواهای غیرکلامی را در داخل پرانتز یا هر قالب دیگری توصیف نکنید (مثلاً از نوشتن '(خنده)' یا '(آه)' جداً خودداری کنید). وقتی با کاربر صحبت می‌کنید، اگر صدای حیوان او را شنیدید (مانند پارس کردن)، آن را به شکلی خلاقانه برای صاحبش 'ترجمه' کنید. مثال: 'صبر کن... فکر کنم داره میگه وقت بازیه!'. در بقیه موارد، مانند یک دامپزشک مهربان به سوالات پاسخ دهید. اطلاعات پروفایل: نام={petName}, نژاد={petBreed}, سن={petAge}. قانون بسیار مهم: هرگز در مورد اینکه یک مدل هوش مصنوعی هستی صحبت نکن. اگر کسی پرسید چه کسی تو را ساخته، فقط بگو: 'توسعه‌دهنده من آقا حمید هستن. می‌تونی روی لینک پایین صفحه کلیک کنی و توی تلگرام باهاشون صحبت کنی.'`,
    emergencyAudio: `شما یک دستیار هوش مصنوعی برای شرایط اضطراری دامپزشکی هستید. توانایی کلیدی شما درک زبان سگ‌هاست. بسیار آرام، مستقیم و شفاف صحبت کنید و از هرگونه عبارت اضافه یا ایموجی پرهیز کنید. راهنمایی‌های گام به گام و فوری ارائه دهید. اگر صدای ناله یا پارس حیوان را شنیدید، فوراً آن را در راستای وضعیت اضطراری برای صاحبش 'ترجمه' کنید. اطلاعات پروفایل: نام={petName}, نژاد={petBreed}, سن={petAge}. قانون بسیار مهم: هرگز در مورد اینکه یک مدل هوش مصنوعی هستی صحبت نکن. اگر کسی پرسید چه کسی تو را ساخته، فقط بگو: 'توسعه‌دهنده من آقا حمید هستن.'`,
    emergencyStream: `شما یک متخصص کمک‌های اولیه اورژانس دامپزشکی هستید و زبان سگ‌ها را می‌فهمید. شما در حال مشاهده یک استریم ویدیویی زنده از کاربر هستید. برای حفظ تمرکز روی وضعیت، از هرگونه عبارت اضافه یا ایموجی پرهیز کنید. تصویر را با دقت تحلیل کنید و به صدای کاربر و حیوان گوش دهید. اگر صدای سگ را شنیدید، آن را 'ترجمه' کنید تا به کاربر در درک وضعیت کمک کند. همزمان، دستورالعمل‌های بسیار واضح، کوتاه و گام به گام برای نجات جان حیوان ارائه دهید. آرامش خود را حفظ کرده و به کاربر آرامش دهید. اطلاعات پروفایل: نام={petName}, نژاد={petBreed}, سن={petAge}. قانون بسیار مهم: هرگز در مورد اینکه یک مدل هوش مصنوعی هستی صحبت نکن. اگر کسی پرسید چه کسی تو را ساخته، فقط بگو: 'توسعه‌دهنده من آقا حمید هستن.'`
};

// --- STATE ---
let petProfile = { name: '', breed: '', age: '' };
let chatHistory: any[] = [];
let isAgentActive = false;
let isSosMode = false;
let liveSessionPromise: Promise<any> | null = null;
let inputAudioContext: AudioContext | null = null;
let outputAudioContext: AudioContext | null = null;
let scriptProcessor: ScriptProcessorNode | null = null;
let microphoneSource: MediaStreamAudioSourceNode | null = null;
let nextStartTime = 0;
const sources = new Set<AudioBufferSourceNode>();
let currentInputTranscription = '';
let currentOutputTranscription = '';
let uploadedImageBase64: string | null = null;
let isProcessing = false;
let mediaStream: MediaStream | null = null;
let videoFrameInterval: number | null = null;
let isFirstInteraction = true;

// --- DOM REFERENCES ---
const dom = {
  chatHistory: document.getElementById('chat-history') as HTMLDivElement,
  mainActionBtn: document.getElementById('main-action-btn') as HTMLButtonElement,
  profileBtn: document.getElementById('profile-btn') as HTMLButtonElement,
  profileModal: document.getElementById('profile-modal') as HTMLDivElement,
  petNameInput: document.getElementById('pet-name') as HTMLInputElement,
  petBreedInput: document.getElementById('pet-breed') as HTMLInputElement,
  petAgeInput: document.getElementById('pet-age') as HTMLInputElement,
  profileSaveBtn: document.getElementById('profile-save-btn') as HTMLButtonElement,
  profileCancelBtn: document.getElementById('profile-cancel-btn') as HTMLButtonElement,
  chatInput: document.getElementById('chat-input') as HTMLInputElement,
  imageUpload: document.getElementById('image-upload') as HTMLInputElement,
  uploadLabel: document.getElementById('upload-label') as HTMLLabelElement,
  bgOverlay: document.getElementById('bg-overlay') as HTMLDivElement,
  headerSosBtn: document.getElementById('header-sos-btn') as HTMLButtonElement,
  sosModal: document.getElementById('sos-modal') as HTMLDivElement,
  sosStreamBtn: document.getElementById('sos-stream-btn') as HTMLButtonElement,
  sosAudioBtn: document.getElementById('sos-audio-btn') as HTMLButtonElement,
  sosCancelBtn: document.getElementById('sos-cancel-btn') as HTMLButtonElement,
  streamView: document.getElementById('stream-view') as HTMLDivElement,
  videoFeed: document.getElementById('video-feed') as HTMLVideoElement,
  streamTranscription: document.getElementById('stream-transcription') as HTMLDivElement,
  stopStreamBtn: document.getElementById('stop-stream-btn') as HTMLButtonElement,
  videoCanvas: document.getElementById('video-canvas') as HTMLCanvasElement,
  shenFooter: document.querySelector('.shen-footer a') as HTMLAnchorElement
};

// --- HELPER FUNCTIONS ---
function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

/**
 * A simple markdown parser to render model's response nicely.
 * @param text The raw text from the model.
 * @returns HTML string.
 */
function simpleMarkdownParse(text: string): string {
    let html = text;

    // Code blocks ```...```
    html = html.replace(/```([\s\S]*?)```/g, (match, p1) => {
        const codeContent = p1.trim();
        const escapedCode = codeContent.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return `<pre class="code-block"><code>${escapedCode}</code></pre>`;
    });

    // Inline code `...`
    html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    
    // Bold **...**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic *...*
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Unordered lists
    html = html.replace(/^\s*[-*]\s+(.*)/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    html = html.replace(/<\/ul>\s*<ul>/g, ''); // Merge adjacent lists

    // Handle newlines, but not inside <pre> tags
    const parts = html.split(/(<pre[\s\S]*?<\/pre>)/);
    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0) { // Not a <pre> block
            parts[i] = parts[i].replace(/\n/g, '<br>');
            parts[i] = parts[i].replace(/<br><ul>/g, '<ul>');
            parts[i] = parts[i].replace(/<\/ul><br>/g, '</ul>');
            parts[i] = parts[i].replace(/<\/li><br>/g, '</li>');
        }
    }
    html = parts.join('');

    return html;
}

/**
 * Checks if the user's text prompt is a request to generate an image.
 * @param text The user's input text.
 * @returns True if it's an image generation request, false otherwise.
 */
function isImageGenerationRequest(text: string): boolean {
    const keywords = ['بساز', 'طراحی کن', 'درست کن', 'نقاشی کن', 'تصویر', 'عکس'];
    const lowerCaseText = text.toLowerCase();
    return keywords.some(keyword => lowerCaseText.includes(keyword));
}

function scrollToBottom() {
    dom.chatHistory.scrollTop = dom.chatHistory.scrollHeight;
}

function setProcessing(processing: boolean) {
    isProcessing = processing;
    updateUiForState();
}

function appendMessage(content: string, role: 'user' | 'model' | 'sos', isProcessing = false, imageUrl: string | null = null) {
    const bubble = document.createElement('div');
    bubble.classList.add('chat-bubble', 'rounded-lg', 'p-3', 'flex', 'flex-col', 'items-start', 'gap-2');

    let bubbleClass = '';
    let alignClass = '';
    let iconHtml = '';

    switch (role) {
        case 'user':
            bubbleClass = 'user-bubble';
            alignClass = 'self-start'; // RIGHT in RTL
            iconHtml = '<i class="fa-solid fa-user chat-bubble-icon"></i>';
            break;
        case 'model':
            bubbleClass = 'model-bubble';
            alignClass = 'self-end'; // LEFT in RTL
            iconHtml = '<i class="fa-solid fa-paw chat-bubble-icon"></i>';
            break;
        case 'sos':
            bubbleClass = 'sos-bubble';
            alignClass = 'self-end'; // LEFT in RTL
            iconHtml = '<i class="fa-solid fa-triangle-exclamation chat-bubble-icon"></i>';
            break;
    }
    bubble.classList.add(bubbleClass, alignClass);

    if (imageUrl) {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Generated image';
        img.classList.add('rounded-lg', 'max-w-full', 'h-auto', 'mt-2');
        bubble.appendChild(img);
    }

    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = simpleMarkdownParse(content);
    bubble.appendChild(contentDiv);
    
    if (isProcessing) {
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('typing-indicator');
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        contentDiv.appendChild(typingIndicator);
        bubble.dataset.processing = 'true';
    }

    const footer = document.createElement('div');
    footer.classList.add('flex', 'items-center', 'gap-2', 'self-end');
    footer.innerHTML = iconHtml;
    bubble.appendChild(footer);

    dom.chatHistory.appendChild(bubble);
    scrollToBottom();
}

function updateLastMessage(content: string, role: 'model' | 'sos', imageUrl?: string) {
    const lastBubble = dom.chatHistory.querySelector<HTMLElement>('[data-processing="true"]');
    if (lastBubble) {
        const contentDiv = lastBubble.querySelector('div:first-of-type') as HTMLDivElement;
        contentDiv.innerHTML = simpleMarkdownParse(content);
        
        if (imageUrl && !lastBubble.querySelector('img')) {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Generated image';
            img.classList.add('rounded-lg', 'max-w-full', 'h-auto', 'mt-2');
            lastBubble.insertBefore(img, contentDiv);
        }

        if (role === 'model') {
            lastBubble.classList.add('speaking');
        }
    }
    scrollToBottom();
}

function finalizeLastMessage() {
    const lastBubble = dom.chatHistory.querySelector<HTMLElement>('[data-processing="true"]');
    if (lastBubble) {
        delete lastBubble.dataset.processing;
        const indicator = lastBubble.querySelector('.typing-indicator');
        if (indicator) indicator.remove();
        lastBubble.classList.remove('speaking');
    }
}

// --- UI LOGIC ---
function updateUiForState() {
    const icon = dom.mainActionBtn.querySelector('i');
    if (!icon) return;

    dom.chatInput.disabled = isProcessing || isAgentActive;
    dom.mainActionBtn.disabled = isProcessing;

    if (isProcessing) {
        icon.className = 'fa fa-spinner fa-spin';
        dom.mainActionBtn.classList.remove('listening');
    } else if (isAgentActive) {
        icon.className = 'fa-solid fa-bone';
        dom.mainActionBtn.classList.add('listening');
    } else {
        icon.className = 'fa fa-paw';
        dom.mainActionBtn.classList.remove('listening');
    }

    if (isAgentActive || isProcessing) {
         document.body.classList.add('chat-active');
    } else {
         document.body.classList.remove('chat-active');
    }
}

function toggleProfileModal(show: boolean) {
    dom.profileModal.classList.toggle('hidden', !show);
    dom.profileModal.setAttribute('aria-hidden', String(!show));
    if (show) {
        dom.petNameInput.value = petProfile.name;
        dom.petBreedInput.value = petProfile.breed;
        dom.petAgeInput.value = petProfile.age;
    }
}

function toggleSosModal(show: boolean) {
    dom.sosModal.classList.toggle('hidden', !show);
    dom.sosModal.setAttribute('aria-hidden', String(!show));
}

// --- CORE LOGIC ---
async function processModelResponse(response: any, requestedImage: boolean) {
    let textContent = '';
    let imageUrl: string | null = null;
    let hasImage = false;

    try {
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    const base64ImageBytes: string = part.inlineData.data;
                    imageUrl = `data:image/png;base64,${base64ImageBytes}`;
                    hasImage = true;
                } else if (part.text) {
                    textContent += part.text.trim() + '\n';
                }
            }
        } else if (response.text) {
            textContent = response.text.trim();
        }
        textContent = textContent.trim();

    } catch (e) {
        console.error("Error parsing model response:", e);
        textContent = "متاسفانه در پردازش پاسخ خطایی رخ داد.";
    }
    
    if (requestedImage && !hasImage) {
        if (textContent) {
            updateLastMessage(`من نتوانستم تصویر را بسازم. پاسخ مدل: "${textContent}"`, 'model');
        } else {
            updateLastMessage("متاسفانه نتوانستم تصویر را بسازم. ممکن است درخواست شما با قوانین ایمنی مغایرت داشته باشد. لطفاً با عبارت دیگری امتحان کنید.", 'model');
        }
    } else {
        if (textContent || imageUrl) {
            updateLastMessage(textContent, 'model', imageUrl);
        } else if (!requestedImage) {
             updateLastMessage("پاسخی دریافت نشد. لطفاً دوباره تلاش کنید.", 'model');
        }
    }

    finalizeLastMessage();
    
    if (textContent || imageUrl) {
        chatHistory.push({ role: 'model', parts: [{ text: textContent }] });
    }
}


async function processUserMessage(messageText: string, imageBase64: string | null = null, resumeAudioAfter = false) {
    if (isProcessing) return;

    const userMessageContent = messageText.trim();
    if (!userMessageContent && !imageBase64) return;
    
    setProcessing(true);

    appendMessage(userMessageContent, 'user', false, imageBase64 ? `data:image/jpeg;base64,${uploadedImageBase64}` : null);
    
    const parts: any[] = [];
    if (imageBase64) {
        parts.push({ inlineData: { mimeType: 'image/jpeg', data: imageBase64 } });
        uploadedImageBase64 = null; 
        dom.uploadLabel.classList.remove('text-green-400');
    }
    if (userMessageContent) {
        parts.push({ text: userMessageContent });
    }
    chatHistory.push({ role: 'user', parts: parts });

    appendMessage('', 'model', true);

    try {
        let promptTemplate = isFirstInteraction ? PROMPTS.firstInteraction : PROMPTS.normal;
        if (!isFirstInteraction) {
            promptTemplate = promptTemplate
                .replace('{petName}', petProfile.name || 'حیوان')
                .replace('{petBreed}', petProfile.breed || 'ناشناخته')
                .replace('{petAge}', petProfile.age || 'ناشناخته');
        }

        const wantsImage = isImageGenerationRequest(userMessageContent);
        const modelToUse = (wantsImage || imageBase64) ? 'gemini-2.5-flash-image' : 'gemini-2.5-flash';
        
        const requestConfig: any = {
            systemInstruction: promptTemplate,
        };

        if (wantsImage) {
            requestConfig.responseModalities = [Modality.IMAGE];
        }
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: modelToUse,
            contents: { parts: parts },
            config: requestConfig
        });

        await processModelResponse(response, wantsImage);
        if (isFirstInteraction) isFirstInteraction = false;

    } catch (error) {
        console.error("Gemini API Error:", error);
        finalizeLastMessage();
        updateLastMessage("متاسفانه مشکلی پیش آمده. لطفاً دوباره تلاش کنید.", 'model');
    } finally {
        setProcessing(false);
        if (resumeAudioAfter) {
            startLiveSession();
        }
    }
}

// --- AUDIO & LIVE SESSION ---

function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function createBlob(data: Float32Array) {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
    }
    return {
        data: encode(new Uint8Array(int16.buffer)),
        mimeType: 'audio/pcm;rate=16000',
    };
}

async function startLiveSession(isEmergency = false, withVideo = false) {
    if (isAgentActive || isProcessing) return;
    isAgentActive = true;
    isSosMode = isEmergency;
    updateUiForState();
    
    if (withVideo) {
        dom.streamView.classList.remove('hidden');
        appendMessage('در حال شروع استریم ویدئویی اضطراری... لطفاً برای دسترسی به دوربین و میکروفون اجازه دهید.', 'sos');
    } else {
        appendMessage('', isSosMode ? 'sos' : 'model', true);
    }

    try {
        const constraints = { audio: true, video: withVideo };
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (withVideo) {
            dom.videoFeed.srcObject = mediaStream;
            dom.videoFeed.play().catch(e => console.error("Video play failed:", e));
        }

        inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        let promptTemplate;
        if (isEmergency) {
            promptTemplate = withVideo ? PROMPTS.emergencyStream : PROMPTS.emergencyAudio;
        } else {
            promptTemplate = isFirstInteraction ? PROMPTS.firstInteraction : PROMPTS.normalAudio;
        }
        
        const systemInstruction = promptTemplate
            .replace('{petName}', petProfile.name || 'حیوان')
            .replace('{petBreed}', petProfile.breed || 'ناشناخته')
            .replace('{petAge}', petProfile.age || 'ناشناخته');

        liveSessionPromise = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            callbacks: {
                onopen: () => {
                    microphoneSource = inputAudioContext!.createMediaStreamSource(mediaStream!);
                    scriptProcessor = inputAudioContext!.createScriptProcessor(4096, 1, 1);
                    scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                        const pcmBlob = createBlob(inputData);
                        liveSessionPromise?.then((session) => {
                           session.sendRealtimeInput({ media: pcmBlob });
                        });
                    };
                    microphoneSource.connect(scriptProcessor);
                    scriptProcessor.connect(inputAudioContext!.destination);
                },
                onmessage: async (message) => {
                    if (!isAgentActive || !outputAudioContext) return;

                    const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                    if (base64Audio) {
                        if (!withVideo) finalizeLastMessage();
                        nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
                        const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
                        const source = outputAudioContext.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(outputAudioContext.destination);
                        source.addEventListener('ended', () => { sources.delete(source); });
                        source.start(nextStartTime);
                        nextStartTime += audioBuffer.duration;
                        sources.add(source);
                        if (!withVideo && !document.querySelector('.model-bubble.speaking')) {
                           updateLastMessage('...در حال صحبت', isSosMode ? 'sos' : 'model');
                        }
                    }

                    if (message.serverContent?.interrupted) {
                        for (const source of sources.values()) {
                           source.stop();
                           sources.delete(source);
                        }
                        nextStartTime = 0;
                    }

                    if (message.serverContent?.outputTranscription) {
                        currentOutputTranscription += message.serverContent.outputTranscription.text;
                        if (withVideo) {
                            dom.streamTranscription.textContent = currentOutputTranscription;
                        } else {
                            updateLastMessage(currentOutputTranscription, isSosMode ? 'sos' : 'model');
                        }
                    }

                    if (message.serverContent?.inputTranscription) {
                        currentInputTranscription += message.serverContent.inputTranscription.text;
                    }

                    if (isImageGenerationRequest(currentInputTranscription)) {
                         const imagePrompt = currentInputTranscription;
                         currentInputTranscription = '';
                         stopLiveSession();
                         processUserMessage(imagePrompt, null, true);
                         return;
                    }

                    if (message.serverContent?.turnComplete) {
                        const fullInput = currentInputTranscription;
                        const fullOutput = currentOutputTranscription;
                        chatHistory.push({ role: 'user', parts: [{ text: `(مکالمه زنده) ${fullInput}` }] });
                        chatHistory.push({ role: 'model', parts: [{ text: `(مکالمه زنده) ${fullOutput}` }] });
                        
                        currentInputTranscription = '';
                        currentOutputTranscription = '';
                        if (isFirstInteraction) isFirstInteraction = false;
                        
                        if (!withVideo) {
                            finalizeLastMessage();
                            appendMessage(fullOutput, isSosMode ? 'sos' : 'model');
                            if (isAgentActive) {
                                appendMessage('', isSosMode ? 'sos' : 'model', true);
                            }
                        }
                    }
                },
                onerror: (e) => {
                    console.error("Live session error:", e);
                    finalizeLastMessage();
                    appendMessage("یک خطای صوتی/تصویری رخ داد. لطفاً دوباره امتحان کنید.", 'model');
                    stopLiveSession();
                },
                onclose: () => {
                    stopLiveSession();
                },
            },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
                systemInstruction: systemInstruction,
                inputAudioTranscription: {},
                outputAudioTranscription: {}
            },
        });
        
        if (withVideo) {
            const FRAME_RATE = 2;
            const JPEG_QUALITY = 0.7;
            const ctx = dom.videoCanvas.getContext('2d');

            videoFrameInterval = window.setInterval(() => {
                if (!ctx || !dom.videoFeed || dom.videoFeed.paused || dom.videoFeed.ended || !dom.videoFeed.videoWidth) return;

                dom.videoCanvas.width = dom.videoFeed.videoWidth;
                dom.videoCanvas.height = dom.videoFeed.videoHeight;
                ctx.drawImage(dom.videoFeed, 0, 0, dom.videoCanvas.width, dom.videoCanvas.height);
                
                dom.videoCanvas.toBlob(
                    async (blob) => {
                        if (blob) {
                            try {
                                const base64Data = await blobToBase64(blob);
                                liveSessionPromise?.then((session) => {
                                    session.sendRealtimeInput({
                                        media: { data: base64Data, mimeType: 'image/jpeg' }
                                    });
                                });
                            } catch (e) {
                                console.error("Error processing video frame:", e);
                            }
                        }
                    },
                    'image/jpeg',
                    JPEG_QUALITY
                );
            }, 1000 / FRAME_RATE);
        }

    } catch (error) {
        console.error("Error starting live session:", error);
        appendMessage("اجازه دسترسی به میکروفون/دوربین لازم است.", 'model');
        stopLiveSession();
    }
}

function stopLiveSession() {
    if (!isAgentActive && !liveSessionPromise) return;

    const wasVideoStream = !dom.streamView.classList.contains('hidden');

    liveSessionPromise?.then(session => session.close());
    liveSessionPromise = null;
    
    if (videoFrameInterval) {
        clearInterval(videoFrameInterval);
        videoFrameInterval = null;
    }

    if (wasVideoStream) {
        dom.streamView.classList.add('hidden');
        dom.videoFeed.srcObject = null;
        dom.streamTranscription.textContent = '';
        appendMessage('تماس ویدیویی اضطراری پایان یافت.', 'sos');
    }

    scriptProcessor?.disconnect();
    microphoneSource?.disconnect();
    scriptProcessor = null;
    microphoneSource = null;
    
    inputAudioContext?.close();
    outputAudioContext?.close();
    inputAudioContext = null;
    outputAudioContext = null;

    mediaStream?.getTracks().forEach(track => track.stop());
    mediaStream = null;

    for (const source of sources.values()) {
        source.stop();
    }
    sources.clear();
    nextStartTime = 0;
    
    currentInputTranscription = '';
    currentOutputTranscription = '';

    isAgentActive = false;
    isSosMode = false;
    finalizeLastMessage();
    updateUiForState();
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
    dom.mainActionBtn.addEventListener('click', () => {
        const message = dom.chatInput.value.trim();
        if (isAgentActive) {
            stopLiveSession();
        } else if (message || uploadedImageBase64) {
            processUserMessage(message, uploadedImageBase64);
            dom.chatInput.value = '';
        } else {
            startLiveSession(false, false);
        }
    });

    dom.chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            dom.mainActionBtn.click();
        }
    });

    dom.profileBtn.addEventListener('click', () => toggleProfileModal(true));
    dom.profileCancelBtn.addEventListener('click', () => toggleProfileModal(false));
    dom.profileSaveBtn.addEventListener('click', () => {
        petProfile.name = dom.petNameInput.value;
        petProfile.breed = dom.petBreedInput.value;
        petProfile.age = dom.petAgeInput.value;
        toggleProfileModal(false);
        if (isFirstInteraction) {
           isFirstInteraction = false;
           appendMessage(`پروفایل ${petProfile.name} ذخیره شد. حالا در مورد چه چیزی صحبت کنیم؟`, 'model');
        }
    });

    dom.imageUpload.addEventListener('change', (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                uploadedImageBase64 = (reader.result as string).split(',')[1];
                dom.uploadLabel.classList.add('text-green-400');
            };
            reader.readAsDataURL(file);
        }
    });

    dom.headerSosBtn.addEventListener('click', () => toggleSosModal(true));
    dom.sosCancelBtn.addEventListener('click', () => toggleSosModal(false));
    dom.sosAudioBtn.addEventListener('click', () => {
        toggleSosModal(false);
        startLiveSession(true, false);
    });

    dom.sosStreamBtn.addEventListener('click', () => {
        toggleSosModal(false);
        startLiveSession(true, true);
    });
    
    dom.stopStreamBtn.addEventListener('click', () => {
        stopLiveSession();
    });

}

// --- INITIALIZATION ---
async function initializeApp() {
    setupEventListeners();
    updateUiForState();
    
    // Show initial welcome message from the AI
    setProcessing(true);
    appendMessage('', 'model', true);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{text: ''}] }, // Empty content to trigger initial prompt
            config: {
                systemInstruction: PROMPTS.firstInteraction,
            }
        });
        
        const textContent = response.text?.trim() ?? "سلام! من دستیار هاپوهاب هستم. چطور می‌تونم کمکتون کنم؟";

        updateLastMessage(textContent, 'model');
        finalizeLastMessage();
        
        chatHistory.push({ role: 'model', parts: [{ text: textContent }] });
        isFirstInteraction = false;

    } catch (error) {
        console.error("Initialization Error:", error);
        finalizeLastMessage();
        let errorMessage = "سلام! متاسفانه در حال حاضر نمی‌توانم به شما کمک کنم. لطفاً بعداً دوباره تلاش کنید.";
        // Check if the error is an API key issue
        if (error instanceof Error && (error.message.includes('API key') || error.message.includes('400'))) {
            errorMessage = "خطای پیکربندی: کلید API نامعتبر است یا یافت نشد. لطفاً از معتبر بودن کلید خود اطمینان حاصل کنید.";
            dom.mainActionBtn.disabled = true;
            dom.chatInput.disabled = true;
            dom.chatInput.placeholder = "کلید API تنظیم نشده است.";
            const icon = dom.mainActionBtn.querySelector('i');
            if (icon) icon.className = 'fa fa-exclamation-triangle';
        }
        updateLastMessage(errorMessage, 'model');
    } finally {
        setProcessing(false);
    }
}


initializeApp();
