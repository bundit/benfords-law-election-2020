// https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript

function fallbackCopyToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    const msg = successful ? "successful" : "unsuccessful";
    console.log(`Fallback: Copying text command was ${msg}`);
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
}

export default function copyToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(
    () => {
      console.log("Async: Copying to clipboard was successful!");
    },
    err => {
      console.error("Async: Could not copy text: ", err);
    }
  );
}
