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


/* to-top button */

// Set a variable for our button element.
const scrollToTopButton = document.getElementById('js-top');
const scrollFunc = () => {
   // Get the current scroll value
   let y = window.scrollY;
    
   // If the scroll value is greater than the window height, let's add a class to the scroll-to-top button to show it!
   if (y > 0) {
     scrollToTopButton.className = "top-link show";
   } else {
     scrollToTopButton.className = "top-link hide";
   }
 };
 window.addEventListener("scroll", scrollFunc);

 const scrollToTop = () => {
   // Let's set a variable for the number of pixels we are from the top of the document.
   const c = document.documentElement.scrollTop || document.body.scrollTop;
    
   // If that number is greater than 0, we'll scroll back to 0, or the top of the document.
   // We'll also animate that scroll with requestAnimationFrame:
   // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
   if (c > 0) {
     window.requestAnimationFrame(scrollToTop);
     // ScrollTo takes an x and a y coordinate.
     // Increase the '10' value to get a smoother/slower scroll!
     window.scrollTo(0, c - c / 10);
   }
 };

 // When the button is clicked, run our ScrolltoTop function above!
scrollToTopButton.onclick = function(e) {
   e.preventDefault();
   scrollToTop();
 }





 /* scroll progress bar  
    source: https://medium.com/@nilayvishwakarma/build-a-scroll-progress-bar-with-vanilla-js-in-10-minutes-or-less-4ba07e2554f3
 */
 document.addEventListener(
   "scroll",
   function() {
     console.log("now scrolling");
     var scrollTop =
       document.documentElement["scrollTop"] || document.body["scrollTop"];

     // changed document.documentElement.clientHeight to document.body.clientHeight  
     var scrollBottom = document.body["scrollHeight"] - document.body.clientHeight;
       
     /* (document.documentElement["scrollHeight"] ||
         document.body["scrollHeight"]) - document.body.clientHeight;
 */

     scrollPercent = scrollTop / scrollBottom * 100 + "%";
     document
       .getElementById("_progress")
       .style.setProperty("--scroll", scrollPercent);
   },
   { passive: true }
 );