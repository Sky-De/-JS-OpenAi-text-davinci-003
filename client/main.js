

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

// while getting answer
function loader(elm) {
    elm.textContent = "";

    loadInterval = setInterval(() => {
        elm.textContent += ".";

        if(elm.textContent === "....") elm.textContent = "";
    }, 300);
}

function typeText(elm, text) {
    let index = 0;

    let interval = setInterval(() => {
        if(index < text.length) {
            elm.innerHTML += text.charAt(index);
            index++
        }else{
            clearInterval(interval);
        }

    },20)
}

function generateUniqueId() {
    const timeStamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timeStamp}-${hexadecimalString}`
}

function chatStripe (isAi, value, uniqueId) {
    return `
    <div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          ${isAi ? "<i class='bx bxs-bot chatIcon' ></i>" : "<i class='bx bxs-user chatIcon' ></i>"}
        </div>
        <div class="message" id=${uniqueId}>${value}</div>
      </div>
    </div>`   
} 

const handleSubmit = async (e) => {
    e.preventDefault();
    chatContainer.scrollTo(0,0);

    const data = new FormData(form);

    // user's chatStripe
    chatContainer.innerHTML = chatStripe(false, data.get("prompt")) + chatContainer.innerHTML;

    form.reset();

    // bot's chatStripe
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML = chatStripe(true, " ", uniqueId) + chatContainer.innerHTML;

    const messageDiv = document.getElementById(uniqueId);

    loader(messageDiv);

    const response = await fetch("http://localhost:2323/",{
        method: "POST",
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    });
   
    clearInterval(loadInterval);
    messageDiv.innerHTML = "";

    if(response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim();

        typeText(messageDiv, parsedData);
    }else {
        const err = await response.text();

        messageDiv.innerHTML = "Something went wrong...!"
        alert(err);
    }
}
// submit---------------------------------
form.addEventListener("submit", handleSubmit);
form.addEventListener("keydown", (e) => {
    if(e.keyCode === 13){
        handleSubmit(e);
    }
})


// toogle-darki-light-mode
const theme_toggle_btn = document.querySelector(".theme-toggle-btn");
theme_toggle_btn.addEventListener("click",()=> {
    document.querySelector("html").classList.toggle("dark");
    document.querySelector(".bx-sun").classList.toggle("hide");
    document.querySelector(".bx-moon").classList.toggle("hide");
    
})