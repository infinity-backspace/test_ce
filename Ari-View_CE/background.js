function reDrawPage() {
  let ytList = document.querySelectorAll('a');
  let ytCode = [];

  const ytIframe1 = `<iframe style="width:100%;height:100%;top:0px;left:0px;position:absolute;opacity:1;" sandbox="allow-scripts allow-same-origin allow-presentation allow-popups" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" frameborder="0" allowfullscreen="1" title="YouTube video player" width="640" height="360" src="https://www.youtube-nocookie.com/embed/`;
  const ytIframe2 = `<iframe style="width:100%;height:100%;top:0px;left:0px;opacity:1;" sandbox="allow-scripts allow-same-origin allow-presentation allow-popups" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" frameborder="0" allowfullscreen="1" title="YouTube video player" width="640" height="360" src="https://www.youtube-nocookie.com/embed/`;
  const ytIframe3 = `?controls=1&amp;modestbranding=1&amp;rel=0&amp;showinfo=1&amp;loop=0&amp;fs=0&amp;hl=ko&amp;enablejsapi=1&amp;widgetid=1"></iframe>`;

  ytList.forEach( elem => {
      if (elem.href.includes("www.youtube.com/watch?v=")==true) {
          const ytLink = elem.href;
          const ytLabel = elem.getAttribute("aria-label");
          if (ytLabel != null && !ytLink.includes("&")) {
              const ytLinkSplit = ytLink.split('=');
              const ytLabelSplit = ytLabel.split(', YouTube ');
              ytCode.push({
                "code": ytLinkSplit.pop(),
                "title": ytLabelSplit[0],
                "desc": ytLabelSplit.pop()
              });
          }
      }
  });

  document.head.innerHTML = `<link rel="preconnect" href="https://fonts.gstatic.com"/><link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic+Coding&display=swap" rel="stylesheet"/>
                             <style type='text/css'> body {background-color:black;color:limegreen;font-family:'Nanum Gothic Coding',sans-serif;} a:hover {background-color: lime; cursor:pointer;}</style>`;
  document.body = document.createElement("body");

  let ytString = `<div id="ytScreen" style='width:900px;'></div>
                  <a id="ytFullLink" style='color:green;'></a><br/>
                  <input id="inputYtCode" type="text" style="background-color:#333333;border:0px;color:limegreen;width:20%;height:20px;padding:5px 12px;border-radius:5px;font-family:'Nanum Gothic Coding',sans-serif;vertical-align: middle;margin: 10px 0px;">
                  <input type="checkbox" id="cbYtFullScreen" style='transform: scale(1.5);vertical-align: middle;'><span style='vertical-align: middle;'> Full Screen</span>
                  <br/><hr style="height:1px;border-width:0;background-color:green;"/>`;
  ytCode.map( elem => {
    ytString = ytString + `<div style='margin-bottom:5px;'><a id="${elem.code}" style="color:green;">${elem.code}</a> <span>${elem.title}</span> <small style="color:green;">${elem.desc}</small></div>`
  });
  ytString = ytString + "<br/><br/><span style='color:green;'>Ari-View CE v1.3</span><br/><br/><span style='color:green;'>=_=</span><br/>"
  document.body.innerHTML = ytString;

  ytCode.map( elem => {
    document.getElementById(elem.code).onclick = function() {
      if (document.getElementById('cbYtFullScreen').checked) {
        document.body.innerHTML = `${ytIframe1}${elem.code}${ytIframe3}`;
      } else {
        const ytIframeString = `${ytIframe2}${elem.code}${ytIframe3}`;
        const ytScreenDiv = document.getElementById('ytScreen');
        ytScreenDiv.style.height = "600px";
        ytScreenDiv.innerHTML = ytIframeString;
        document.getElementById("inputYtCode").value = elem.code;
        const ytFullLinkString = `https://www.youtube.com/watch?v=${elem.code}`;
        document.getElementById("ytFullLink").innerText = ytFullLinkString;
        navigator.clipboard.writeText(ytFullLinkString);
      }
    }
  });

  document.getElementById("inputYtCode").onkeyup = function() {
    if (window.event.keyCode == 13) {
      const strYtCode = document.getElementById("inputYtCode").value.trim();
      if (document.getElementById('cbYtFullScreen').checked) {
        document.body.innerHTML = `${ytIframe1}${strYtCode}${ytIframe3}`;
      } else {
        const ytIframeString = `${ytIframe2}${strYtCode}${ytIframe3}`;
        const ytScreenDiv = document.getElementById('ytScreen');
        ytScreenDiv.style.height = "600px";
        ytScreenDiv.innerHTML = ytIframeString;
        const ytFullLinkString = `https://www.youtube.com/watch?v=${strYtCode}`;
        document.getElementById("ytFullLink").innerText = ytFullLinkString;
        navigator.clipboard.writeText(ytFullLinkString);
      }
    }
  }

  return "done";
}

chrome.action.onClicked.addListener((tab) => {
  if(!tab.url.includes("chrome://")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: reDrawPage
    },
    (result) => {
      console.log(">>>>", result);
    });
  }
});