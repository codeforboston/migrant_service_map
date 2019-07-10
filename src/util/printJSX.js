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

function printJSX(contents) {
  const { contentWindow } = printIFrame;
  ReactDOM.render(contents, printContentDiv, () => {
    contentWindow.focus();
    contentWindow.print();
  });
}

export { printJSX };
