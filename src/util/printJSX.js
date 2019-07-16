import ReactDOM from "react-dom";
const printIFrame = document.createElement("iframe");
const printContentDivId = "printContent";
document.body.appendChild(printIFrame);
printIFrame.contentWindow.document.open();
printIFrame.contentWindow.document.write(`<div id="${printContentDivId}" />`);
printIFrame.contentWindow.document.close();
printIFrame.display = "none";
const printContentDiv = printIFrame.contentWindow.document.getElementById(
  printContentDivId
);

const cssLink = document.createElement("link");
cssLink.href = "print.css";
cssLink.rel = "stylesheet";
cssLink.type = "text/css";
printIFrame.contentWindow.document.head.appendChild(cssLink);

function printJSX(contents) {
  const { contentWindow } = printIFrame;
  ReactDOM.render(contents, printContentDiv, () => {
    contentWindow.focus();
    contentWindow.print();
  });
}

export { printJSX };
