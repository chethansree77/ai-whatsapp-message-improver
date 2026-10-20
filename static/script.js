
// ========================================
// AI WHATSAPP MESSAGE IMPROVER
// COMPLETE JAVASCRIPT
// ========================================


let selectedStyle = "Professional";

let messageHistory =
    JSON.parse(
        localStorage.getItem("messageHistory")
    ) || [];


// ========================================
// STYLE SELECTION
// ========================================

function selectStyle(button) {

    const cards =
        document.querySelectorAll(".style-card");

    cards.forEach(card => {

        card.classList.remove("active");

    });


    button.classList.add("active");


    selectedStyle =
        button.dataset.style;


    const resultStyle =
        document.getElementById(
            "resultStyle"
        );


    if (resultStyle) {

        resultStyle.textContent =
            selectedStyle;

    }


    // Update live preview

    updateStylePreview(
        selectedStyle
    );
}


// ========================================
// LIVE STYLE PREVIEW
// ========================================

function updateStylePreview(style) {

    const previewStyle =
        document.getElementById(
            "previewStyle"
        );

    const previewMessage =
        document.getElementById(
            "previewMessage"
        );


    if (
        !previewStyle ||
        !previewMessage
    ) {

        return;

    }


    const previews = {

        "Professional":
            "Hello everyone, please attend tomorrow's class at 10:00 AM.",

        "Friendly":
            "Hi everyone! 😊 Please join tomorrow's class at 10:00 AM.",

        "Formal":
            "All students are requested to attend tomorrow's class at 10:00 AM.",

        "Short and Simple":
            "Class tomorrow at 10:00 AM. Everyone must attend."

    };


    previewStyle.textContent =
        style;


    // Small animation

    previewMessage.style.opacity =
        "0";

    previewMessage.style.transform =
        "translateY(5px)";


    setTimeout(() => {

        previewMessage.textContent =
            previews[style] ||
            previews["Professional"];


        previewMessage.style.opacity =
            "1";

        previewMessage.style.transform =
            "translateY(0)";

    }, 150);

}


// ========================================
// IMPROVE MESSAGE
// ========================================

async function improveMessage() {

    const messageInput =
        document.getElementById(
            "messageInput"
        );


    const resultSection =
        document.getElementById(
            "resultSection"
        );


    const resultBox =
        document.getElementById(
            "resultBox"
        );


    const button =
        document.querySelector(
            ".improve-button"
        );


    const buttonText =
        document.getElementById(
            "buttonText"
        );


    const buttonIcon =
        document.getElementById(
            "buttonIcon"
        );


    const message =
        messageInput.value.trim();


    if (!message) {

        alert(
            "Please enter a WhatsApp message."
        );

        messageInput.focus();

        return;
    }


    if (message.length > 500) {

        alert(
            "Message must be 500 characters or less."
        );

        return;
    }


    // Loading state

    button.classList.add(
        "loading"
    );

    button.disabled =
        true;


    buttonIcon.innerHTML = `
        <span class="ai-loader">
            <span></span>
            <span></span>
            <span></span>
        </span>
    `;


    buttonText.textContent =
        "AI is improving...";


    resultBox.textContent =
        "Creating your improved message...";


    resultSection.style.display =
        "block";


    try {

        const response =
            await fetch(
                "/improve",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        message:
                            message,

                        style:
                            selectedStyle

                    })

                }
            );


        if (!response.ok) {

            throw new Error(
                "Server error: " +
                response.status
            );

        }


        const data =
            await response.json();


        if (data.success) {

            resultBox.textContent =
                data.message;


            resultSection.style.display =
                "block";


            updateMessageStats(
                data.message,
                selectedStyle
            );


            addToHistory(
                data.message,
                selectedStyle
            );


            setTimeout(() => {

                resultSection.scrollIntoView({

                    behavior:
                        "smooth",

                    block:
                        "center"

                });

            }, 100);


        } else {

            showError(
                data.error ||
                "Unable to improve the message."
            );

        }


    } catch (error) {

        console.error(
            "Error:",
            error
        );


        showError(
            "Unable to connect to the AI service. " +
            "Please make sure the Flask server is running."
        );


    } finally {

        button.classList.remove(
            "loading"
        );


        button.disabled =
            false;


        buttonIcon.textContent =
            "✨";


        buttonText.textContent =
            "Improve Message";

    }

}


// ========================================
// ERROR
// ========================================

function showError(message) {

    const resultSection =
        document.getElementById(
            "resultSection"
        );


    const resultBox =
        document.getElementById(
            "resultBox"
        );


    resultBox.textContent =
        "⚠️ " + message;


    resultSection.style.display =
        "block";

}


// ========================================
// COPY MESSAGE
// ========================================

async function copyMessage() {

    const resultBox =
        document.getElementById(
            "resultBox"
        );


    const text =
        resultBox.textContent.trim();


    if (
        !text ||
        text ===
        "Your improved message will appear here." ||
        text ===
        "Creating your improved message..."
    ) {

        alert(
            "There is no message to copy."
        );

        return;
    }


    if (
        text.startsWith("⚠️")
    ) {

        return;

    }


    try {

        await navigator.clipboard.writeText(
            text
        );


        showCopySuccess();


    } catch (error) {

        console.error(
            "Copy error:",
            error
        );


        alert(
            "Unable to copy the message."
        );

    }

}


// ========================================
// COPY SUCCESS
// ========================================

function showCopySuccess() {

    const copyButton =
        document.querySelector(
            ".copy-button"
        );


    if (!copyButton) {

        return;

    }


    const originalText =
        copyButton.innerHTML;


    copyButton.innerHTML =
        "✅ Copied!";


    copyButton.style.background =
        "#dcfce7";


    copyButton.style.color =
        "#16a34a";


    setTimeout(() => {

        copyButton.innerHTML =
            originalText;


        copyButton.style.background =
            "";


        copyButton.style.color =
            "";

    }, 1500);

}


// ========================================
// DOWNLOAD MESSAGE
// ========================================

function downloadMessage() {

    const resultBox =
        document.getElementById(
            "resultBox"
        );


    const message =
        resultBox.textContent.trim();


    if (
        !message ||
        message ===
        "Your improved message will appear here." ||
        message ===
        "Creating your improved message..."
    ) {

        alert(
            "There is no message to download."
        );

        return;
    }


    if (
        message.startsWith("⚠️")
    ) {

        alert(
            "There is no valid message to download."
        );

        return;
    }


    const blob =
        new Blob(
            [message],
            {
                type:
                    "text/plain;charset=utf-8"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "improved_whatsapp_message.txt";


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );

}


// ========================================
// SHARE MESSAGE
// ========================================

async function shareMessage() {

    const resultBox =
        document.getElementById(
            "resultBox"
        );


    const message =
        resultBox.textContent.trim();


    if (
        !message ||
        message ===
        "Your improved message will appear here." ||
        message ===
        "Creating your improved message..."
    ) {

        alert(
            "There is no message to share."
        );

        return;
    }


    if (
        message.startsWith("⚠️")
    ) {

        alert(
            "There is no valid message to share."
        );

        return;
    }


    if (navigator.share) {

        try {

            await navigator.share({

                title:
                    "Improved WhatsApp Message",

                text:
                    message

            });


        } catch (error) {

            if (
                error.name !==
                "AbortError"
            ) {

                console.error(
                    "Share error:",
                    error
                );


                alert(
                    "Unable to share the message."
                );

            }

        }

    } else {

        alert(
            "Sharing is not supported by this browser. " +
            "Please use the Copy button instead."
        );

    }

}


// ========================================
// CHARACTER COUNTER
// ========================================

const messageInput =
    document.getElementById(
        "messageInput"
    );


const charCount =
    document.getElementById(
        "charCount"
    );


if (
    messageInput &&
    charCount
) {

    messageInput.addEventListener(
        "input",
        function () {

            const currentLength =
                messageInput.value.length;


            charCount.textContent =
                currentLength +
                " / 500 characters";

        }
    );

}


// ========================================
// CLEAR MESSAGE
// ========================================

function clearMessage() {

    const messageInput =
        document.getElementById(
            "messageInput"
        );


    const charCount =
        document.getElementById(
            "charCount"
        );


    messageInput.value =
        "";


    if (charCount) {

        charCount.textContent =
            "0 / 500 characters";

    }


    messageInput.focus();

}


// ========================================
// MESSAGE STATISTICS
// ========================================

function updateMessageStats(
    message,
    style
) {

    const wordCount =
        document.getElementById(
            "wordCount"
        );


    const resultCharCount =
        document.getElementById(
            "resultCharCount"
        );


    const readingTime =
        document.getElementById(
            "readingTime"
        );


    const resultStyle =
        document.getElementById(
            "resultStyle"
        );


    const words =
        message
            .trim()
            .split(/\s+/)
            .filter(
                word =>
                    word.length > 0
            );


    const totalWords =
        words.length;


    if (wordCount) {

        wordCount.textContent =
            totalWords;

    }


    if (resultCharCount) {

        resultCharCount.textContent =
            message.length;

    }


    const seconds =
        Math.max(
            1,
            Math.ceil(
                (totalWords / 200) * 60
            )
        );


    if (readingTime) {

        if (seconds < 60) {

            readingTime.textContent =
                seconds + " sec";

        } else {

            const minutes =
                Math.ceil(
                    seconds / 60
                );


            readingTime.textContent =
                minutes + " min";

        }

    }


    if (resultStyle) {

        resultStyle.textContent =
            style;

    }

}


// ========================================
// ADD TO HISTORY
// ========================================

function addToHistory(
    message,
    style
) {

    messageHistory.unshift({

        message:
            message,

        style:
            style,

        time:
            new Date().toLocaleString()

    });


    if (
        messageHistory.length > 10
    ) {

        messageHistory =
            messageHistory.slice(
                0,
                10
            );

    }


    localStorage.setItem(
        "messageHistory",
        JSON.stringify(
            messageHistory
        )
    );


    renderHistory();

}


// ========================================
// RENDER HISTORY
// ========================================

function renderHistory() {

    const historyList =
        document.getElementById(
            "historyList"
        );


    if (!historyList) {

        return;

    }


    if (
        messageHistory.length === 0
    ) {

        historyList.innerHTML = `

            <p class="empty-history">

                Your improved messages
                will appear here.

            </p>

        `;


        return;

    }


    historyList.innerHTML =
        messageHistory
            .map(
                (item, index) => {

                    return `

                        <div class="history-item">

                            <span class="history-style">

                                ${escapeHTML(
                                    item.style
                                )}

                            </span>


                            <div class="history-message">

                                ${escapeHTML(
                                    item.message
                                )}

                            </div>


                            <div class="history-time">

                                ${escapeHTML(
                                    item.time
                                )}

                            </div>


                            <div class="history-actions">


                                <button
                                    type="button"
                                    class="history-copy-button"
                                    onclick="copyHistoryMessage(${index})"
                                >

                                    📋 Copy

                                </button>


                                <button
                                    type="button"
                                    class="history-restore-button"
                                    onclick="restoreHistoryMessage(${index})"
                                >

                                    ↩️ Restore

                                </button>


                                <button
                                    type="button"
                                    class="history-delete-button"
                                    onclick="deleteHistoryMessage(${index})"
                                >

                                    🗑️ Delete

                                </button>


                            </div>


                        </div>

                    `;

                }
            )
            .join("");

}


// ========================================
// COPY HISTORY MESSAGE
// ========================================

async function copyHistoryMessage(
    index
) {

    if (
        !messageHistory[index]
    ) {

        return;

    }


    const message =
        messageHistory[index]
            .message;


    try {

        await navigator.clipboard.writeText(
            message
        );


        alert(
            "Message copied! 📋"
        );


    } catch (error) {

        console.error(
            "Copy error:",
            error
        );


        alert(
            "Unable to copy message."
        );

    }

}


// ========================================
// RESTORE HISTORY MESSAGE
// ========================================

function restoreHistoryMessage(
    index
) {

    if (
        !messageHistory[index]
    ) {

        return;

    }


    const item =
        messageHistory[index];


    const resultSection =
        document.getElementById(
            "resultSection"
        );


    const resultBox =
        document.getElementById(
            "resultBox"
        );


    resultBox.textContent =
        item.message;


    resultSection.style.display =
        "block";


    selectedStyle =
        item.style;


    const cards =
        document.querySelectorAll(
            ".style-card"
        );


    cards.forEach(card => {

        card.classList.remove(
            "active"
        );


        if (
            card.dataset.style ===
            item.style
        ) {

            card.classList.add(
                "active"
            );

        }

    });


    updateMessageStats(
        item.message,
        item.style
    );


    updateStylePreview(
        item.style
    );


    resultSection.scrollIntoView({

        behavior:
            "smooth",

        block:
            "center"

    });

}


// ========================================
// DELETE HISTORY MESSAGE
// ========================================

function deleteHistoryMessage(
    index
) {

    if (
        !messageHistory[index]
    ) {

        return;

    }


    const confirmDelete =
        confirm(
            "Delete this message from history?"
        );


    if (!confirmDelete) {

        return;

    }


    messageHistory.splice(
        index,
        1
    );


    localStorage.setItem(
        "messageHistory",
        JSON.stringify(
            messageHistory
        )
    );


    renderHistory();

}


// ========================================
// CLEAR ALL HISTORY
// ========================================

function clearHistory() {

    if (
        messageHistory.length === 0
    ) {

        return;

    }


    const confirmClear =
        confirm(
            "Are you sure you want to clear all message history?"
        );


    if (!confirmClear) {

        return;

    }


    messageHistory =
        [];


    localStorage.removeItem(
        "messageHistory"
    );


    renderHistory();

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(
    text
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


// ========================================
// RESULT EDITOR
// ========================================

function setupResultEditor() {

    const resultBox =
        document.getElementById(
            "resultBox"
        );


    if (!resultBox) {

        return;

    }


    resultBox.addEventListener(
        "input",
        function () {

            const currentMessage =
                resultBox.textContent.trim();


            updateMessageStats(
                currentMessage,
                selectedStyle
            );

        }
    );

}


// ========================================
// QUICK MESSAGE TEMPLATES
// ========================================

function useTemplate(type) {

    const messageInput =
        document.getElementById(
            "messageInput"
        );


    const charCount =
        document.getElementById(
            "charCount"
        );


    const templates = {

        class:
            "tomorrow class is at 10 am all students please attend",

        work:
            "please complete the work and send it to me before tomorrow",

        meeting:
            "meeting is scheduled for tomorrow at 10 am everyone please attend",

        request:
            "please help me with this when you have some time",

        invitation:
            "we are happy to invite you to our event please join us",

        leave:
            "i will be on leave tomorrow due to personal reasons",

        payment:
            "please complete the pending payment at your earliest convenience",

        announcement:
            "important announcement please make sure everyone is informed"

    };


    if (!templates[type]) {

        return;

    }


    messageInput.value =
        templates[type];


    if (charCount) {

        charCount.textContent =
            messageInput.value.length +
            " / 500 characters";

    }


    messageInput.focus();


    messageInput.setSelectionRange(

        messageInput.value.length,

        messageInput.value.length

    );


    messageInput.scrollIntoView({

        behavior:
            "smooth",

        block:
            "center"

    });

}


// ========================================
// PAGE LOAD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderHistory();

        setupResultEditor();


        const resultStyle =
            document.getElementById(
                "resultStyle"
            );


        if (resultStyle) {

            resultStyle.textContent =
                selectedStyle;

        }


        // Show initial preview

        updateStylePreview(
            selectedStyle
        );

    }
);
