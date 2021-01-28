const contactDiv = document.querySelector("#contact");

scrollingElement = (document.scrollingElement || document.body)
function scrollToBottom () {
   scrollingElement.scrollTop = scrollingElement.scrollHeight;
   // change div border color
   contactDiv.style.backgroundColor = "#e4c8c8";
   
   setTimeout(() => {
      contactDiv.style.backgroundColor = "#ffffff";
   }, 2000)
}

