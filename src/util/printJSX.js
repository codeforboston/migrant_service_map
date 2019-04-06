import ReactDOM from "react-dom";
const printIFrame = document.createElement("iframe");
const printContentNode = document.createElement("div");
document.body.appendChild(printIFrame);
printIFrame.contentWindow.document.body.appendChild(printContentNode);
printIFrame.display = "none";

function printJSX(contents) {
  const { contentWindow } = printIFrame;
  ReactDOM.render(contents, printContentNode, () => {
    contentWindow.focus();
    contentWindow.print();
  });
}

export { printJSX };
