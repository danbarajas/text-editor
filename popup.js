// ** DEFAULT VALUES AND VARIABLES **
const ROWS = 4;
const COLS = 50;
const PLACEHOLDERS = [ "Type something...", "Enter anything..." ];
textInput.placeholder = PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)];

const body = document.getElementsByTagName("body")[0];

// Load all default settings
function loadDefaults() {
    textInput.rows = ROWS;
    textInput.cols = COLS;
    wordCt.style.visibility = "visible";
    charCt.style.visibility = "visible";
    paraCt.style.visibility = "visible";
}

// First time load
loadDefaults();

// Select all text when text box gains focus
textInput.addEventListener("focus", () => {
    textInput.select();
});

// ** HELPER FUNCTIONS **

// Fully trim the given string and return, removing leading, trailing, and repetitive whitespace
function fullTrim(str) {
    var trimmed = str.trim();
    for (var i = 0; i < trimmed.length; i++) {
        if ((trimmed[i] == "\n" && trimmed[i + 1] == "\n") ||
            (trimmed[i] == " " && (trimmed[i + 1] == "\n" || trimmed[i + 1] == " "))) {
            trimmed = trimmed.slice(0, i) + trimmed.slice(i + 1);
            i--;
        }
    }
    return trimmed;
}

// Display an alert when a button is clicked
function alertMsg(message) {
    alertDiv.innerHTML = message;
    alertDiv.style.visibility = "visible";
    alertDiv.style.opacity = 1;
    setTimeout(() => {
        alertDiv.style.opacity = 0;
        setTimeout(() => {
            alertDiv.style.visibility = "hidden";
        }, 500);
    }, 2000);
}

// Make all elements with class "collapsible" collapsible
var collapsibles = document.getElementsByClassName("collapsible");
for (var i = 0; i < collapsibles.length; i++) {
    collapsibles[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight)
            content.style.maxHeight = null;
        else
            content.style.maxHeight = content.scrollHeight + "px";
    });
}

// ** STAT COUNTING **

// Update count of words, characters, and paragraphs in text box
function updateStatCount() {
    var trimmed = fullTrim(textInput.value); // Easier for some stats to have whitespace removed

    // CHARACTER COUNT    
    var chars = textInput.value.length - textInput.value.split("\n").length + 1; // All characters except newlines

    // WORD COUNT
    var modTrim = trimmed.replace(/\n|\t/g, " "); // Replace newlines and tabs with spaces for simplicity
    var words = chars == 0 ? 0 : modTrim.split(" ").length; // If there are no characters, there are no words
    
    // PARAGRAPH COUNT
    var paras = chars == 0 ? 0 : trimmed.split("\n").length; // If there are no characters, there are no paragraphs

    // Display stats if enabled
    var wordStr = words == 1 ? " word" : " words";
    var charStr = chars == 1 ? " character" : " characters";
    var paraStr = paras == 1 ? " paragraph" : " paragraphs";


    statCount.innerHTML = words + wordStr + chars + charStr + paras + paraStr;
}

// Update word count on input
textInput.addEventListener("input", () => {
    updateStatCount();
});

// ** FORMAT BUTTONS **

// Convert text to uppercase when uppercase button is clicked
upperBtn.addEventListener("click", () => {
    textInput.value = textInput.value.toUpperCase();
    alertMsg("Uppercased!");
});

// Convert text to lowercase when lowercase button is clicked
lowerBtn.addEventListener("click", () => {
    textInput.value = textInput.value.toLowerCase();
    alertMsg("Lowercased!");
});

// Convert text to capital case when capital button is clicked
capitalBtn.addEventListener("click", () => {
    var capitalized = textInput.value.toLowerCase();
    for (var i = 0; i < capitalized.length; i++) {
        if (i == 0 || capitalized[i - 1] == " " || capitalized[i - 1] == "\n")
            capitalized = capitalized.slice(0, i) + capitalized[i].toUpperCase() + capitalized.slice(i + 1);
    }
    textInput.value = capitalized;
    alertMsg("Capitalized!");
});

// Remove leading, trailing, and repetitive whitespace when trim button is clicked
trimBtn.addEventListener("click", () => {
    textInput.value = fullTrim(textInput.value);
    updateStatCount();
    alertMsg("Trimmed!");
});

// Copy text to clipboard when copy button is clicked
copyBtn.addEventListener("click", () => {
    textInput.select();
    navigator.clipboard.writeText(textInput.value);
    alertMsg("Copied!");
});

// Cut text to clipboard when cut button is clicked
cutBtn.addEventListener("click", () => {
    textInput.select();
    navigator.clipboard.writeText(textInput.value);
    textInput.value = "";
    updateStatCount();
    alertMsg("Cut!");
});

// Paste text from clipboard when paste button is clicked
pasteBtn.addEventListener("click", async () => {
    textInput.value = await navigator.clipboard.readText();
    updateStatCount();
    alertMsg("Pasted!");
});

// Clear text when clear button is clicked
clearBtn.addEventListener("click", () => {
    textInput.value = "";
    updateStatCount();
    alertMsg("Cleared!");
});

// ** SETTINGS MENU **

// * SETTINGS MENU BUTTONS *
// OPEN settings menu when settings button is clicked
settingsBtn.addEventListener("click", () => {
    // Set values to current settings
    sRow.value = textInput.rows;
    sCol.value = textInput.cols;

    body.style.minHeight = "500px";
    settingsDiv.style.visibility = "visible";
});

// CLOSE settings menu when cancel button is clicked
sCancelBtn.addEventListener("click", () => {
    settingsDiv.style.visibility = "hidden";
    body.style.minHeight = 0;
});

// RESET settings to default values when reset button is clicked
sResetBtn.addEventListener("click", () => {
    loadDefaults();
    settingsDiv.style.visibility = "hidden";
    body.style.minHeight = 0;
});

// UPDATE settings values when save button is clicked
sSaveBtn.addEventListener("click", () => {
    // ROWS
    // Set text box rows with min/max values
    if (Number(sRow.value) < Number(sRow.min))
        textInput.rows = sRow.min;
    else if (Number(sRow.value) > Number(sRow.max))
        textInput.rows = sRow.max;
    else
        textInput.rows = sRow.value;

    // COLS
    // Set text box columns with min/max values
    if (Number(sCol.value) < Number(sCol.min))
        textInput.cols = sCol.min;
    else if (Number(sCol.value) > Number(sCol.max))
        textInput.cols = sCol.max;
    else
        textInput.cols = sCol.value;

    settingsDiv.style.visibility = "hidden";
    body.style.minHeight = 0;
});