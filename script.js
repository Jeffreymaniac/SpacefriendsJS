// SpaceFriendsJS, Version 0.01. Made by JaecadeJnight. I hope you enjoy it!
// License: CC BY-NC-SA
// What the license means means:
/*
 BY: credit must be given to the creator.
 NC: Only noncommercial uses of the work are permitted.
 SA: Adaptations must be shared under the same terms.
*/
// Started on January 20th, 2025
document.head.insertAdjacentHTML(
    'beforeend',
    '<link rel="stylesheet" href="/spacefriends.css" />');
document.head.insertAdjacentHTML(
    'beforeend',
    '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />');
document.body.insertAdjacentHTML(
    'beforeend',
    '<script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>');
class Spacefriends {

  // Class constructor
  constructor() {
    this.version = "V0.01";  // Instance property
    this.currentYear = new Date().getFullYear();
  }

  // Toggle fullscreen method
  toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  // Method to change the favicon
  changeFavicon(iconUrl) {
    // Check if a link element with rel="icon" exists
    let favicon = document.querySelector("link[rel='icon']");

    if (!favicon) {
      // If the favicon doesn't exist, create one
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }

    // Set the new favicon URL
    favicon.href = iconUrl;
  }
  // Fetch API method with GET/POST support
  async fetchData(url, method = 'GET', body = null) {
    const options = {
      method: method,  // Specify GET or POST
      headers: {
        'Content-Type': 'application/json'
      },
    };

    if (method === 'POST' && body) {
      options.body = JSON.stringify(body);  // Convert body to JSON for POST requests
    }

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log("Data fetched successfully:", data);
      return data;  // Returning the data for further use
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

  // XMLHttpRequest method with GET/POST support
  fetchDataXHR(url, method = 'GET', body = null, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);

    // Set up the request headers
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        // Request was successful, pass the response to the callback
        console.log("Data fetched successfully:", JSON.parse(xhr.responseText));
        callback(null, JSON.parse(xhr.responseText));
      } else {
        // Request failed, call the callback with an error
        callback(`Error: ${xhr.status} - ${xhr.statusText}`);
      }
    };

    xhr.onerror = function() {
      callback('Request failed');
    };

    // Add body to the request if it's a POST request
    if (method === 'POST' && body) {
      xhr.send(JSON.stringify(body));  // Sending the body as JSON
    } else {
      xhr.send();  // Send the request without a body for GET requests
    }
  }
  storageAvailable(type) {
    let storage;
    try {
      storage = window[type];
      const x = "__storage_test__";
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        e.name === "QuotaExceededError" &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
      );
    }
  }
  makeElemDraggable(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = document.getElementById(elmnt.id + "header");
    
    // If there is a header, make that the draggable area
    if (header) {
      header.addEventListener("mousedown", dragMouseDown);
    } else {
      // If no header, make the whole element draggable
      elmnt.addEventListener("mousedown", dragMouseDown);
    }

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // Get the initial mouse cursor position:
      pos3 = e.clientX;
      pos4 = e.clientY;
      
      // Add event listeners for moving and releasing the mouse
      document.addEventListener("mouseup", closeDragElement);
      document.addEventListener("mousemove", elementDrag);
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      
      // Calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      // Set the new position of the element
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
      // Stop dragging when mouse button is released
      document.removeEventListener("mouseup", closeDragElement);
      document.removeEventListener("mousemove", elementDrag);
    }
 }
  copyText(ttext) {
    // Get the text field
    var copyText = document.getElementById(ttext);

    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);

    // Alert the copied text
    alert("Copied the text: " + copyText.value);
 }
  loadJS(url, implementationCode, location = document.body){
    var scriptTag = document.createElement('script');
    scriptTag.src = url;

    scriptTag.onload = implementationCode;
    scriptTag.onreadystatechange = implementationCode;

    location.appendChild(scriptTag);
 }

}
class TimeFormatted extends HTMLElement {

  render() { // (1)
    let date = new Date(this.getAttribute('datetime') || Date.now());

    this.innerHTML = new Intl.DateTimeFormat("default", {
      year: this.getAttribute('year') || undefined,
      month: this.getAttribute('month') || undefined,
      day: this.getAttribute('day') || undefined,
      hour: this.getAttribute('hour') || undefined,
      minute: this.getAttribute('minute') || undefined,
      second: this.getAttribute('second') || undefined,
      timeZoneName: this.getAttribute('time-zone-name') || undefined,
    }).format(date);
  }

  connectedCallback() { // (2)
    if (!this.rendered) {
      this.render();
      this.rendered = true;
    }
  }

  static get observedAttributes() { // (3)
    return ['datetime', 'year', 'month', 'day', 'hour', 'minute', 'second', 'time-zone-name'];
  }

  attributeChangedCallback(name, oldValue, newValue) { // (4)
    this.render();
  }

}
class Donut extends HTMLElement {
  render() { // (1)
    let statPercent = this.getAttribute('stat');
    let statType = this.getAttribute('type');
    if(!statType){
      this.setAttribute("type","positive");
      statType="positive";
    }
    this.innerHTML = `<div class="spacefriendsdonut" style="--spacefriends-donut:${statPercent}%;--spacefriends-donuttype:${statType};">${statPercent}%</div>`;
  }

  connectedCallback() { // (2)
    if (!this.rendered) {
      this.render();
      this.rendered = true;
    }
  }

  static get observedAttributes() { // (3)
    return ['type', 'stat'];
  }

  attributeChangedCallback(name, oldValue, newValue) { // (4)
    this.render();
  }

}
class ToyButton extends HTMLElement {
  render() { // (1)
    let btnColor = this.getAttribute('c');
    this.setAttribute("role", "button");
    this.setAttribute("type", "button");
    this.setAttribute("tabindex", "0");
    if(!btnColor) {
      this.setAttribute("c", "red");
      btnColor="red";
    }

  }

  connectedCallback() { // (2)
    if (!this.rendered) {
      this.render();
      this.rendered = true;
    }
  }

  static get observedAttributes() { // (3)
    return ['c'];
  }

  attributeChangedCallback(name, oldValue, newValue) { // (4)
    this.render();
  }

}
class ImgGallery extends HTMLElement {
  render() { // (1)
    let galType = this.getAttribute('type');
    this.setAttribute("id","imggallery"+crypto.randomUUID())
    let internalID = this.getAttribute('id');
    if(!galType) {
      this.setAttribute("type","gallery");
      galType="gallery";
    }
    if(galType=="carousel"){
      document.body.insertAdjacentHTML(
    'beforeend',
    `<script>
            var slideIndex=0;
          function showDivs(n) {
            var x = document.getElementById('${internalID}').getElementsByTagName('img');
            if (n > x.length) { slideIndex = 0; }
            if (n < 1) { slideIndex = x.length; }
            for (let i = 0; i < x.length; i++) {
              x[i].style.display = "block!important";  
            }
            x[slideIndex].style.display = "block!important";  
            x[slideIndex].focus();  

          }
          showDivs(0);

    </script>`);
      this.innerHTML += `
        <button class="spacefriends-carousel-pbtn" onclick="slideIndex=slideIndex-1;showDivs(slideIndex);">&#10094;</button>
        <button class="spacefriends-carousel-pbtn2" onclick="slideIndex=slideIndex+1;showDivs(slideIndex);">&#10095;</button>
      `;
    this.setAttribute("role", "group");
    this.setAttribute("aria-roledescription", "carousel");
    } else{
    this.setAttribute("role", "group");
    this.setAttribute("aria-label", "Image Gallery");
    }

  }

  connectedCallback() { // (2)
    if (!this.rendered) {
      this.render();
      this.rendered = true;
    }
  }

  static get observedAttributes() { // (3)
    return ['type'];
  }

  attributeChangedCallback(name, oldValue, newValue) { // (4)
    this.render();
  }

}
customElements.define("toy-button", ToyButton);
customElements.define("s-donut", Donut);
customElements.define("s-time", TimeFormatted);
customElements.define("img-gallery", ImgGallery);
