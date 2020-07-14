document.addEventListener("DOMContentLoaded",function(){var i="white bg-dark-blue",l="black bg-white";function u(e){return null===e?[]:Array.prototype.slice.call(e)}function c(t,e){e.split(" ").forEach(function(e){t.classList.toggle(e)})}function o(e){var t;e.hasAttribute("data-display")||(t=document.body.appendChild(document.createElement(e.nodeName)),e.setAttribute("data-display",window.getComputedStyle(e).getPropertyValue("display")),document.body.removeChild(t)),e.style.display=e.getAttribute("data-display")}function a(e){var t;e.hasAttribute("data-display")||(t=document.body.appendChild(document.createElement(e.nodeName)),e.setAttribute("data-display",window.getComputedStyle(e).getPropertyValue("display")),document.body.removeChild(t)),e.style.display="none"}function d(t,e){return e.map(function(e){return e[t]})}var n,s=u(document.querySelectorAll("article")).map(function(e){return{id:e.getAttribute("id"),title:e.querySelector("h1").innerText,content:e.querySelector("main").innerText,categories:u(e.querySelectorAll("header li")).map(function(e){return e.innerText})}}),e=(n=function n(e,r){return 0<(r=r||1/0)?e.reduce(function(e,t){return e.concat(Array.isArray(t)?n(t,r-1):t)},[]):e.slice()}(d("categories",s))).filter(function(e,t){return n.indexOf(e)===t}),m={questions:new Fuse(s,{keys:["title","content"]})};Stickyfill.add(document.querySelector("#controls")),document.querySelector("#titleList").addEventListener("results",function(e){var t=e.detail.input,n=e.detail.results;0===n.length&&0===t.length?document.querySelector("#titleList").innerHTML="":(document.querySelector("#titleList").innerHTML='<ul class="mw7 center db pl0"></ul>',n.map(function(t){var e=document.createElement("A");e.href="#",e.innerHTML=t.title,e.addEventListener("click",function(e){e.preventDefault(),a(document.querySelector("#titleList")),document.querySelector("#"+t.id).scrollIntoView({behavior:"smooth"})});var n=document.createElement("LI");n.className="mv1",n.insertAdjacentElement("beforeend",e),document.querySelector("#titleList ul").insertAdjacentElement("beforeend",n)}))}),document.querySelector("#questions").addEventListener("filter",function(e){var t,n=e.detail.input,r=e.detail.results;0===r.length&&0===n.length?u(document.querySelectorAll("article")).forEach(function(e){o(e)}):(t=d("id",r),u(document.querySelectorAll("article")).forEach(function(e){(0<=t.indexOf(e.getAttribute("id"))?o:a)(e)}))}),document.querySelector("#searchBar").addEventListener("focus",function(){"none"===document.querySelector("#titleList").style.display&&o(document.querySelector("#titleList"))}),document.querySelector("#searchBar").addEventListener("input",function(e){e.preventDefault();var t,n=e.target.value,r=(t=n,d("item",m.questions.search(t)));document.querySelector("#questions").dispatchEvent(new CustomEvent("filter",{detail:{results:r,input:n}})),document.querySelector("#titleList").dispatchEvent(new CustomEvent("results",{detail:{results:r,input:n}}))}),e.map(function(e){var t=document.createElement("BUTTON");t.innerHTML=e,t.className="f6 grow no-underline br-pill ba ph3 pv2 mb2 mr2 black bg-white b--black pointer",t.setAttribute("data-target",e),t.addEventListener("click",function(t){t.preventDefault();var n,r=t.target.getAttribute("data-target"),e=(n=t.target,i.split(" ").reduce(function(e,t){return e||n.classList.contains(t)},!1));c(t.target,i+" "+l),u(document.querySelectorAll("."+i.replace(/ /g,"."))).filter(function(e){return e!==t.target}).forEach(function(e){c(e,i+" "+l)}),document.querySelector("#questions").dispatchEvent(new CustomEvent("filter",{detail:{results:e?[]:s.filter(function(e){return 0<=e.categories.indexOf(r)}),input:e?"":r}}))});var n=document.createElement("LI");n.className="dib",n.insertAdjacentElement("beforeend",t),document.querySelector("#categories ul").insertAdjacentElement("beforeend",n)})});