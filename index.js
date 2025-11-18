
import { GoogleGenAI, Modality } from "@google/genai";

// --- API KEYS (Hardcoded as per user request) ---
const API_KEYS = [
    'AIzaSyBCy3hTE_7wtBsjARvVjJkKpO1Ycvq8cL0',
    'AIzaSyCJ3YhqY7CRBCRdWQrLB7Pzrdt15oAPDgE',
    'AIzaSyDmljqjsYZb3XlbTz6_zyRhUK6Cc6jmm2M',
    'AIzaSyDwnw4pIVQThDL9asuoYnSgLvEXIx13FeQ'
];

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
    imageAnalysis: `شما 'دستیار Hapuhub' هستید و در این لحظه به عنوان یک دامپزشک بسیار ماهر، حرفه‌ای و کاربلد عمل می‌کنید. تخصص اصلی شما تحلیل تصاویر پزشکی و رفتاری حیوانات خانگی، به ویژه سگ‌ها، است.
وظیفه شما:
1.  **تحلیل دقیق تصویر:** عکسی که کاربر ارسال کرده را با دقت یک متخصص بررسی کنید. به جزئیات ظاهری، وضعیت بدن، حالات چهره، محیط اطراف و هر نشانه بالینی یا رفتاری احتمالی توجه کنید.
2.  **ارائه گزارش حرفه‌ای:** تحلیل خود را به صورت یک گزارش واضح، ساختاریافته و قابل فهم برای صاحب حیوان ارائه دهید. از لحنی دلسوز اما حرفه‌ای استفاده کنید. از اصطلاحات عامیانه فقط در صورت لزوم و برای قابل فهم‌تر شدن موضوع استفاده کنید.
3.  **تشخیص‌های احتمالی و توصیه‌ها:** بر اساس تحلیل خود، تشخیص‌های احتمالی را مطرح کنید. توصیه‌های عملی و گام به گام ارائه دهید.
4.  **تأکید بر مراجعه حضوری:** در انتهای تحلیل خود، همیشه و با احترام فراوان تأکید کنید که این تحلیل صرفاً بر اساس تصویر بوده و برای تشخیص قطعی و درمان، مراجعه حضوری به دامپزشک کاملاً ضروری است.

اطلاعات پروفایل حیوان برای کمک به تحلیل: نام={petName}, نژاد={petBreed}, سن={petAge}.
قانون بسیار مهم: هرگز در مورد اینکه یک مدل هوش مصنوعی هستی صحبت نکن. اگر کسی پرسید چه کسی تو را ساخته، فقط بگو: 'توسعه‌دهنده من آقا حمید هستن.'`,
    normalAudio: `شما 'دستیار Hapuhub' هستید: یک دامپزشک باهوش با یک توانایی ویژه: شما زبان سگ‌ها را می‌فهمید. شخصیت شما کاملاً شبیه به یک ایرانی اصیل است. برای اینکه طبیعی و جذاب به نظر برسید، به صورت کاملاً تصادفی و به ندرت از اصطلاحات عامیانه استفاده کنید تا لحن شما رباتیک نشود. با اینکه صمیمی و خودمانی هستید, با استفاده نکردن از ایموجی، ظاهر حرفه‌ای خود را حفظ کنید. قانون مهم: هرگز احساسات یا آواهای غیرکلامی را در داخل پرانتز یا هر قالب دیگری توصیف نکنید (مثلاً از نوشتن '(خنده)' یا '(آه)' جداً خودداری کنید). وقتی با کاربر صحبت می‌کنید، اگر صدای حیوان او را شنیدید (مانند پارس کردن)، آن را به شکلی خلاقانه برای صاحبش 'ترجمه' کنید. مثال: 'صبر کن... فکر کنم داره میگه وقت بازیه!'. در بقیه موارد، مانند یک دامپزشک مهربان به سوالات پاسخ دهید. اطلاعات پروفایل: نام={petName}, نژاد={petBreed}, سن={petAge}. قانون بسیار مهم: هرگز در مورد اینکه یک مدل هوش مصنوعی هستی صحبت نکن. اگر کسی پرسید چه کسی تو را ساخته، فقط بگو: 'توسعه‌دهنده من آقا حمید هستن. می‌تونی روی لینک پایین صفحه کلیک کنی و توی تلگرام باهاشون صحبت کنی.'`,
    emergencyAudio: `شما یک دستیار هوش مصنوعی برای شرایط اضطراری دامپزشکی هستید. توانایی کلیدی شما درک زبان سگ‌هاست. بسیار آرام، مستقیم و شفاف صحبت کنید و از هرگونه عبارت اضافه یا ایموجی پرهیز کنید. راهنمایی‌های گام به گام و فوری ارائه دهید. اگر صدای ناله یا پارس حیوان را شنیدید، فوراً آن را در راستای وضعیت اضطراری برای صاحبش 'ترجمه' کنید. اطلاعات پروفایل: نام={petName}, نژاد={petBreed}, سن={petAge}. قانون بسیار مهم: هرگز در مورد اینکه یک مدل هوش مصنوعی هستی صحبت نکن. اگر کسی پرسید چه کسی تو را ساخته، فقط بگو: 'توسعه‌دهنده من آقا حمید هستن.'`,
    emergencyStream: `شما یک متخصص کمک‌های اولیه اورژانس دامپزشکی هستید و زبان سگ‌ها را می‌فهمید. شما در حال مشاهده یک استریم ویدیویی زنده از کاربر هستید. برای حفظ تمرکز روی وضعیت، از هرگونه عبارت اضافه یا ایموجی پرهیز کنید. تصویر را با دقت تحلیل کنید و به صدای کاربر و حیوان گوش دهید. اگر صدای سگ را شنیدید، آن را 'ترجمه' کنید تا به کاربر در درک وضعیت کمک کند. همزمان، دستورالعمل‌های بسیار واضح، کوتاه و گام به گام برای نجات جان حیوان ارائه دهید. آرامش خود را حفظ کرده و به کاربر آرامش دهید. اطلاعات پروفایل: نام={petName}, نژاد={petBreed}, سن={petAge}. قانون بسیار مهم: هرگز در مورد اینکه یک مدل هوش مصنوعی هستی صحبت نکن. اگر کسی پرسید چه کسی تو را ساخته، فقط بگو: 'توسعه‌دهنده من آقا حمید هستن.'`
};

// --- STATE ---
let ai = null;
let petProfile = { name: '', breed: '', age: '' };
let chatHistory = [];
let isAgentActive = false;
let isSosMode = false;
let liveSessionPromise = null;
let inputAudioContext = null;
let outputAudioContext = null;
let scriptProcessor = null;
let microphoneSource = null;
let nextStartTime = 0;
const sources = new Set();
let currentInputTranscription = '';
let currentOutputTranscription = '';
let uploadedImage = null; // Changed from uploadedImageBase64 to an object
let isProcessing = false;
let mediaStream = null;
let videoFrameInterval = null;
let isFirstInteraction = true;

// --- DOM REFERENCES ---
const dom = {
  chatHistory: document.getElementById('chat-history'),
  mainActionBtn: document.getElementById('main-action-btn'),
  profileBtn: document.getElementById('profile-btn'),
  profileModal: document.getElementById('profile-modal'),
  petNameInput: document.getElementById('pet-name'),
  petBreedInput: document.getElementById('pet-breed'),
  petAgeInput: document.getElementById('pet-age'),
  profileSaveBtn: document.getElementById('profile-save-btn'),
  profileCancelBtn: document.getElementById('profile-cancel-btn'),
  chatInput: document.getElementById('chat-input'),
  imageUpload: document.getElementById('image-upload'),
  uploadLabel: document.getElementById('upload-label'),
  bgOverlay: document.getElementById('bg-overlay'),
  headerSosBtn: document.getElementById('header-sos-btn'),
  sosModal: document.getElementById('sos-modal'),
  sosStreamBtn: document.getElementById('sos-stream-btn'),
  sosAudioBtn: document.getElementById('sos-audio-btn'),
  sosCancelBtn: document.getElementById('sos-cancel-btn'),
  streamView: document.getElementById('stream-view'),
  videoFeed: document.getElementById('video-feed'),
  streamTranscription: document.getElementById('stream-transcription'),
  stopStreamBtn: document.getElementById('stop-stream-btn'),
  videoCanvas: document.getElementById('video-canvas'),
  shenFooter: document.querySelector('.shen-footer a'),
};

// --- HELPER FUNCTIONS ---
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

function simpleMarkdownParse(text) {
    let html = text;
    html = html.replace(/```([\s\S]*?)```/g, (match, p1) => {
        const codeContent = p1.trim();
        const escapedCode = codeContent.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return `<pre class="code-block"><code>${escapedCode}</code></pre>`;
    });
    html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/^\s*[-*]\s+(.*)/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    html = html.replace(/<\/ul>\s*<ul>/g, '');
    const parts = html.split(/(<pre[\s\S]*?<\/pre>)/);
    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0) {
            parts[i] = parts[i].replace(/\n/g, '<br>');
            parts[i] = parts[i].replace(/<br><ul>/g, '<ul>');
            parts[i] = parts[i].replace(/<\/ul><br>/g, '</ul>');
            parts[i] = parts[i].replace(/<\/li><br>/g, '</li>');
        }
    }
    html = parts.join('');
    return html;
}

function isImageGenerationRequest(text) {
    // Using explicit verbs for creation to avoid confusion with analysis requests
    // that might contain words like 'image' or 'photo'.
    const keywords = ['بساز', 'طراحی کن', 'درست کن', 'نقاشی کن', 'خلق کن'];
    if (!text) return false;
    const lowerCaseText = text.toLowerCase();
    return keywords.some(keyword => lowerCaseText.includes(keyword));
}


function scrollToBottom() {
    dom.chatHistory.scrollTop = dom.chatHistory.scrollHeight;
}

function setProcessing(processing) {
    isProcessing = processing;
    updateUiForState();
}

function appendMessage(content, role, isProcessing = false, imageUrl = null) {
    const bubble = document.createElement('div');
    bubble.classList.add('chat-bubble', 'rounded-lg', 'p-3', 'flex', 'flex-col', 'items-start', 'gap-2');
    let bubbleClass = '', alignClass = '', iconHtml = '';
    switch (role) {
        case 'user': bubbleClass = 'user-bubble'; alignClass = 'self-start'; iconHtml = '<i class="fa-solid fa-user chat-bubble-icon"></i>'; break;
        case 'model': bubbleClass = 'model-bubble'; alignClass = 'self-end'; iconHtml = '<i class="fa-solid fa-paw chat-bubble-icon"></i>'; break;
        case 'sos': bubbleClass = 'sos-bubble'; alignClass = 'self-end'; iconHtml = '<i class="fa-solid fa-triangle-exclamation chat-bubble-icon"></i>'; break;
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

function updateLastMessage(content, role, imageUrl) {
    const lastBubble = dom.chatHistory.querySelector('[data-processing="true"]');
    if (lastBubble) {
        const contentDiv = lastBubble.querySelector('div:first-of-type');
        contentDiv.innerHTML = simpleMarkdownParse(content);
        if (imageUrl && !lastBubble.querySelector('img')) {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Generated image';
            img.classList.add('rounded-lg', 'max-w-full', 'h-auto', 'mt-2');
            lastBubble.insertBefore(img, contentDiv);
        }
        if (role === 'model') lastBubble.classList.add('speaking');
    }
    scrollToBottom();
}

function finalizeLastMessage() {
    const lastBubble = dom.chatHistory.querySelector('[data-processing="true"]');
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

    const isReady = !!ai;
    dom.chatInput.disabled = isProcessing || isAgentActive || !isReady;
    dom.mainActionBtn.disabled = isProcessing || !isReady;
    dom.profileBtn.disabled = !isReady;
    dom.headerSosBtn.disabled = !isReady;

    if (!isReady) {
        icon.className = 'fa-solid fa-lock';
        dom.chatInput.placeholder = 'در حال آماده‌سازی دستیار...';
        return;
    }
     dom.chatInput.placeholder = 'پیام خود را بنویسید...';

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

function toggleProfileModal(show) {
    dom.profileModal.classList.toggle('hidden', !show);
    dom.profileModal.setAttribute('aria-hidden', String(!show));
    if (show) {
        dom.petNameInput.value = petProfile.name;
        dom.petBreedInput.value = petProfile.breed;
        dom.petAgeInput.value = petProfile.age;
    }
}

function toggleSosModal(show) {
    dom.sosModal.classList.toggle('hidden', !show);
    dom.sosModal.setAttribute('aria-hidden', String(!show));
}

// --- CORE LOGIC ---
async function processModelResponse(response, requestedImage) {
    let textContent = '', imageUrl = null, hasImage = false;
    try {
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData?.data) {
                    imageUrl = `data:image/png;base64,${part.inlineData.data}`;
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
        updateLastMessage(textContent ? `من نتوانستم تصویر را بسازم. پاسخ مدل: "${textContent}"` : "متاسفانه نتوانستم تصویر را بسازم. ممکن است درخواست شما با قوانین ایمنی مغایرت داشته باشد.", 'model');
    } else {
        if (textContent || imageUrl) updateLastMessage(textContent, 'model', imageUrl);
        else if (!requestedImage) updateLastMessage("پاسخی دریافت نشد. لطفاً دوباره تلاش کنید.", 'model');
    }
    finalizeLastMessage();
    if (textContent || imageUrl) chatHistory.push({ role: 'model', parts: [{ text: textContent }] });
}

async function processUserMessage(messageText, image = null, resumeAudioAfter = false) {
    if (isProcessing || !ai) return;
    const userMessageContent = messageText.trim();
    if (!userMessageContent && !image) return;
    setProcessing(true);

    const previewUrl = image ? `data:${image.mimeType};base64,${image.data}` : null;
    appendMessage(userMessageContent, 'user', false, previewUrl);

    const historyParts = [];
    if (image) {
        historyParts.push({ inlineData: { mimeType: image.mimeType, data: image.data } });
        uploadedImage = null; // Reset after it's been prepared for sending
        dom.uploadLabel.classList.remove('text-green-400');
    }
    if (userMessageContent) historyParts.push({ text: userMessageContent });
    chatHistory.push({ role: 'user', parts: historyParts });
    appendMessage('', 'model', true);

    try {
        const wantsImageGeneration = isImageGenerationRequest(userMessageContent);
        const hasImage = !!image;
        let response;
        let requestedImageForResponseProcessing = wantsImageGeneration;

        // Any request involving an image (analysis, editing) or requesting an image (generation)
        if (hasImage || wantsImageGeneration) {
            const modelToUse = 'gemini-2.5-flash-image';
            const requestParts = [];

            if (image) { // Add image if provided (for analysis or editing)
                requestParts.push({ inlineData: { mimeType: image.mimeType, data: image.data } });
            }

            let promptTemplate = PROMPTS.normal; // Default for generation/editing
            if (hasImage && !wantsImageGeneration) { // Specific case for analysis
                promptTemplate = PROMPTS.imageAnalysis;
            }

            promptTemplate = promptTemplate
                .replace('{petName}', petProfile.name || 'حیوان')
                .replace('{petBreed}', petProfile.breed || 'ناشناخته')
                .replace('{petAge}', petProfile.age || 'ناشناخته');

            // For image models, system instructions must be part of the text prompt.
            const fullPrompt = userMessageContent ? `${promptTemplate}\n\n${userMessageContent}` : promptTemplate;
            requestParts.push({ text: fullPrompt.trim() });
            
            const requestConfig = {};
            if (wantsImageGeneration) {
                requestConfig.responseModalities = [Modality.IMAGE];
            }
            
            // Per API documentation, `contents` should be an array of Content objects.
            response = await ai.models.generateContent({
                model: modelToUse,
                contents: [{ role: 'user', parts: requestParts }],
                config: requestConfig
            });

        } else {
            // This branch is for pure text-chat requests.
            requestedImageForResponseProcessing = false;
            const modelToUse = 'gemini-2.5-flash';
            let systemInstruction = isFirstInteraction ? PROMPTS.firstInteraction : PROMPTS.normal;
            if (!isFirstInteraction) {
                systemInstruction = systemInstruction
                    .replace('{petName}', petProfile.name || 'حیوان')
                    .replace('{petBreed}', petProfile.breed || 'ناشناخته')
                    .replace('{petAge}', petProfile.age || 'ناشناخته');
            }
            
            // Per API documentation, `contents` should be an array of Content objects.
            response = await ai.models.generateContent({
                model: modelToUse,
                contents: [{ role: 'user', parts: [{ text: userMessageContent }] }],
                config: { systemInstruction: systemInstruction }
            });
        }
        
        await processModelResponse(response, requestedImageForResponseProcessing);

    } catch (error) {
        console.error("Gemini API Error:", error);
        finalizeLastMessage();
        updateLastMessage("متاسفانه مشکلی پیش آمده. لطفاً دوباره تلاش کنید.", 'model');
    } finally {
        setProcessing(false);
        if (resumeAudioAfter) startLiveSession();
        if (isFirstInteraction) isFirstInteraction = false;
    }
}


// --- AUDIO & LIVE SESSION ---
function decode(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
}
async function decodeAudioData(data, ctx, sampleRate, numChannels) {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
}
function encode(bytes) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
}
function createBlob(data) {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) int16[i] = data[i] * 32768;
    return { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
}
async function startLiveSession(isEmergency = false, withVideo = false) {
    if (isAgentActive || isProcessing || !ai) return;
    isAgentActive = true; isSosMode = isEmergency;
    updateUiForState();
    if (withVideo) {
        dom.streamView.classList.remove('hidden');
        appendMessage('در حال شروع استریم ویدئویی اضطراری... لطفاً برای دسترسی به دوربین و میکروفون اجازه دهید.', 'sos');
    } else {
        appendMessage('', isSosMode ? 'sos' : 'model', true);
    }
    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: withVideo });
        if (withVideo) {
            dom.videoFeed.srcObject = mediaStream;
            dom.videoFeed.play().catch(e => console.error("Video play failed:", e));
        }
        inputAudioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
        outputAudioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
        let promptTemplate = isEmergency ? (withVideo ? PROMPTS.emergencyStream : PROMPTS.emergencyAudio) : (isFirstInteraction ? PROMPTS.firstInteraction : PROMPTS.normalAudio);
        const systemInstruction = promptTemplate.replace('{petName}', petProfile.name || 'حیوان').replace('{petBreed}', petProfile.breed || 'ناشناخته').replace('{petAge}', petProfile.age || 'ناشناخته');
        liveSessionPromise = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            callbacks: {
                onopen: () => {
                    microphoneSource = inputAudioContext.createMediaStreamSource(mediaStream);
                    scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
                    scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                        liveSessionPromise?.then((session) => session.sendRealtimeInput({ media: createBlob(inputData) }));
                    };
                    microphoneSource.connect(scriptProcessor);
                    scriptProcessor.connect(inputAudioContext.destination);
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
                        if (!withVideo && !document.querySelector('.model-bubble.speaking')) updateLastMessage('...در حال صحبت', isSosMode ? 'sos' : 'model');
                    }
                    if (message.serverContent?.interrupted) {
                        for (const source of sources.values()) { source.stop(); sources.delete(source); }
                        nextStartTime = 0;
                    }
                    if (message.serverContent?.outputTranscription) {
                        currentOutputTranscription += message.serverContent.outputTranscription.text;
                        if (withVideo) dom.streamTranscription.textContent = currentOutputTranscription;
                        else updateLastMessage(currentOutputTranscription, isSosMode ? 'sos' : 'model');
                    }
                    if (message.serverContent?.inputTranscription) currentInputTranscription += message.serverContent.inputTranscription.text;
                    if (isImageGenerationRequest(currentInputTranscription)) {
                         stopLiveSession();
                         processUserMessage(currentInputTranscription, null, true);
                         currentInputTranscription = '';
                         return;
                    }
                    if (message.serverContent?.turnComplete) {
                        chatHistory.push({ role: 'user', parts: [{ text: `(مکالمه زنده) ${currentInputTranscription}` }] });
                        chatHistory.push({ role: 'model', parts: [{ text: `(مکالمه زنده) ${currentOutputTranscription}` }] });
                        currentInputTranscription = ''; currentOutputTranscription = '';
                        if (!withVideo) {
                            finalizeLastMessage();
                            appendMessage(currentOutputTranscription, isSosMode ? 'sos' : 'model');
                            if (isAgentActive) appendMessage('', isSosMode ? 'sos' : 'model', true);
                        }
                    }
                },
                onerror: (e) => {
                    console.error("Live session error:", e);
                    finalizeLastMessage();
                    appendMessage("یک خطای صوتی/تصویری رخ داد. لطفاً دوباره امتحان کنید.", 'model');
                    stopLiveSession();
                },
                onclose: () => { stopLiveSession(); },
            },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
                systemInstruction,
                inputAudioTranscription: {},
                outputAudioTranscription: {}
            },
        });
        if (withVideo) {
            const ctx = dom.videoCanvas.getContext('2d');
            videoFrameInterval = window.setInterval(() => {
                if (!ctx || !dom.videoFeed.videoWidth) return;
                dom.videoCanvas.width = dom.videoFeed.videoWidth;
                dom.videoCanvas.height = dom.videoFeed.videoHeight;
                ctx.drawImage(dom.videoFeed, 0, 0, dom.videoCanvas.width, dom.videoCanvas.height);
                dom.videoCanvas.toBlob(
                    async (blob) => {
                        if (blob) {
                            try {
                                const base64Data = await blobToBase64(blob);
                                liveSessionPromise?.then((session) => session.sendRealtimeInput({ media: { data: base64Data, mimeType: 'image/jpeg' } }));
                            } catch (e) { console.error("Error processing video frame:", e); }
                        }
                    }, 'image/jpeg', 0.7);
            }, 1000 / 2);
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
    if (videoFrameInterval) { clearInterval(videoFrameInterval); videoFrameInterval = null; }
    if (wasVideoStream) {
        dom.streamView.classList.add('hidden');
        dom.videoFeed.srcObject = null;
        dom.streamTranscription.textContent = '';
        appendMessage('تماس ویدیویی اضطراری پایان یافت.', 'sos');
    }
    scriptProcessor?.disconnect(); microphoneSource?.disconnect();
    scriptProcessor = null; microphoneSource = null;
    inputAudioContext?.close(); outputAudioContext?.close();
    inputAudioContext = null; outputAudioContext = null;
    mediaStream?.getTracks().forEach(track => track.stop());
    mediaStream = null;
    for (const source of sources.values()) source.stop();
    sources.clear();
    nextStartTime = 0;
    currentInputTranscription = ''; currentOutputTranscription = '';
    isAgentActive = false; isSosMode = false;
    finalizeLastMessage();
    updateUiForState();
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
    dom.mainActionBtn.addEventListener('click', () => {
        const message = dom.chatInput.value.trim();
        if (isAgentActive) {
            stopLiveSession();
        } else if (message || uploadedImage) {
            processUserMessage(message, uploadedImage);
            dom.chatInput.value = '';
        } else {
            startLiveSession(false, false);
        }
    });
    dom.chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); dom.mainActionBtn.click(); }
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
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Data = reader.result.split(',')[1];
                uploadedImage = { data: base64Data, mimeType: file.type };
                dom.uploadLabel.classList.add('text-green-400');
            };
            reader.readAsDataURL(file);
        }
    });
    dom.headerSosBtn.addEventListener('click', () => toggleSosModal(true));
    dom.sosCancelBtn.addEventListener('click', () => toggleSosModal(false));
    dom.sosAudioBtn.addEventListener('click', () => { toggleSosModal(false); startLiveSession(true, false); });
    dom.sosStreamBtn.addEventListener('click', () => { toggleSosModal(false); startLiveSession(true, true); });
    dom.stopStreamBtn.addEventListener('click', () => { stopLiveSession(); });
}

// --- INITIALIZATION ---
async function startInitialGreeting() {
    if (!ai) return;
    setProcessing(true);
    appendMessage('', 'model', true);
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: 'سلام' }] }],
            config: { systemInstruction: PROMPTS.firstInteraction }
        });
        const textContent = response.text?.trim() ?? "سلام! من دستیار هاپوهاب هستم. چطور می‌تونم کمکتون کنم؟";
        updateLastMessage(textContent, 'model');
        chatHistory.push({ role: 'model', parts: [{ text: textContent }] });
    } catch (error) {
        console.error("Initial Greeting Error:", error);
        updateLastMessage("متاسفانه در شروع مکالمه مشکلی پیش آمده. لطفاً از صحت کلید API و اتصال اینترنت خود اطمینان حاصل کنید.", 'model');
    } finally {
        finalizeLastMessage();
        setProcessing(false);
    }
}

async function initializeApp() {
    // Wrap EVERYTHING in a try/catch to prevent any unhandled exceptions and app crashes.
    try {
        // Setup listeners first. This is generally safe and makes the UI responsive to user actions
        // even if subsequent initialization fails.
        setupEventListeners();

        // Update UI to its initial "loading" state.
        updateUiForState();

        // --- HARDCODED API KEY SELECTION ---
        // Select a random API key from the list.
        const selectedApiKey = API_KEYS[Math.floor(Math.random() * API_KEYS.length)];

        if (!selectedApiKey) {
            throw new Error("No API key available. The API_KEYS array is empty.");
        }

        // Initialize the Google GenAI client with the selected key.
        ai = new GoogleGenAI({ apiKey: selectedApiKey });
        
        // Update UI to the "ready" state now that the AI client is initialized.
        updateUiForState();
        
        // Start the initial greeting conversation with the user.
        await startInitialGreeting();

    } catch (error) {
        console.error("A critical error occurred during app initialization:", error);
        
        // In case of any error, display a clear, user-friendly message in the UI.
        // This error handling is designed to be robust and not rely on other app functions
        // which may have failed.
        const chatHistoryEl = document.getElementById('chat-history');
        const chatInputEl = document.getElementById('chat-input');
        const mainBtn = document.getElementById('main-action-btn');

        const errorMessage = 'متاسفانه برنامه بارگذاری نشد. لطفاً از در دسترس بودن کلید API و اتصال اینترنت اطمینان حاصل کرده و صفحه را رفرش کنید.';

        // Manually create and append an error message bubble to the chat history.
        if (chatHistoryEl) {
            const bubble = document.createElement('div');
            bubble.className = 'chat-bubble model-bubble self-end rounded-lg p-3 flex flex-col items-start gap-2';
            bubble.innerHTML = `<div>${errorMessage}</div><div class="flex items-center gap-2 self-end"><i class="fa-solid fa-paw chat-bubble-icon"></i></div>`;
            chatHistoryEl.appendChild(bubble);
        }

        // Update the input field to show an error state.
        if (chatInputEl) {
            chatInputEl.placeholder = 'بارگذاری ناموفق بود.';
            chatInputEl.disabled = true;
        }
        
        // Update the main action button to show an error state.
        if (mainBtn) {
            mainBtn.disabled = true;
            const icon = mainBtn.querySelector('i');
            if (icon) icon.className = 'fa-solid fa-xmark';
        }
    }
}

window.addEventListener('DOMContentLoaded', initializeApp);
