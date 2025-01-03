const img = document.createElement("img");
img.src = "https://webpack.js.org/icon-square-small-slack.1c7f4f7a52c41f94.png";
img.style = "width: auto;";

const container = document.createElement("div");
container.appendChild(img);

const text = document.createElement("div");
text.textContent = "Hello Webpack!";
container.append(text);

container.style =
  "position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);";

container.onclick = () => window.open("https://webpack.js.org/");

document.body.appendChild(container);
