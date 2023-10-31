import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

function loader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    element.textContent += ".";

    if (element.textContent == "....") {
      element.textContent = "";
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

function generateUniqueId() {
  const timeStamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timeStamp}-{hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
  return `
  <div class="wrapper ${isAi && "ai"}">
  <div class="chat">
    <div class="profile">
      <img src="${isAi ? bot : user}"/>
    </div>
    <div class="message" id=${uniqueId}>${value}</div>
  </div>
  </div>
`;
}


const handleSubmit = async(e) => {
  e.preventDefault()  //Prevent default behaviour of browser which is to reload when you submit a form

  const data = new FormData(form)

  //user's chatstripe
  chatContainer.innerHTML += chatStripe(false,data.get('prompt'))

  //bot's chatstripe
  const uniqueId = generateUniqueId()
  chatContainer.innerHTML += chatStripe(true," ",uniqueId)

  chatContainer.scrollTop = chatContainer.scrollHeight

  const messageDiv = document.getElementById(uniqueId)

  loader(messageDiv)

  //fetch data from server == bot's response

  const response = await fetch('https://codex-u6pb.onrender.com', {
    method:"POST",
    headers: {
      "Content-type":"application/json"
    },
    body: JSON.stringify({
      prompt:data.get('prompt')
    })
  })

  clearInterval(loadInterval)

  messageDiv.innerHTML = ""

  if(response.ok) {
    const data = await response.json()
    const parsedData = data.bot.trim()
    typeText(messageDiv,parsedData)
  }

  else {
    const err = await response.text()
    messageDiv.innerHTML = "something went wrong"

    alert(err)
  }

}

form.addEventListener('submit',handleSubmit)
form.addEventListener('keyup', function(e) {
  if(e.key === 'Enter') {
    handleSubmit(e)
  }
})

function openModal() {
  document.getElementById("myModal").style.display = "block";
  console.log("Called")
}

function closeModal() {
  document.getElementById("myModal").style.display = "none";
  console.log("Called")
}

// Close the modal when the background is clicked
window.onclick = function(event) {
  var modal = document.getElementById("myModal");
  if (event.target == modal) {
      modal.style.display = "none";
  }
}

window.onload = function(event) {
  openModal()
}
