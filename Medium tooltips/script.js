const svgs = `
  <div class="tooltip__icon">
    <svg class="tooltip__icon__svg">
      <path d="M19.074 21.117c-1.244 0-2.432-.37-3.532-1.096a7.792 7.792 0 0 1-.703-.52c-.77.21-1.57.32-2.38.32-4.67 0-8.46-3.5-8.46-7.8C4 7.7 7.79 4.2 12.46 4.2c4.662 0 8.457 3.5 8.457 7.803 0 2.058-.85 3.984-2.403 5.448.023.17.06.35.118.55.192.69.537 1.38 1.026 2.04.15.21.172.48.058.7a.686.686 0 0 1-.613.38h-.03z" fill-rule="evenodd"></path>
    </svg>
  </div>
  <div class="tooltip__icon">
    <svg class="tooltip__icon__svg">
      <path d="M19.074 21.117c-1.244 0-2.432-.37-3.532-1.096a7.792 7.792 0 0 1-.703-.52c-.77.21-1.57.32-2.38.32-4.67 0-8.46-3.5-8.46-7.8C4 7.7 7.79 4.2 12.46 4.2c4.662 0 8.457 3.5 8.457 7.803 0 2.058-.85 3.984-2.403 5.448.023.17.06.35.118.55.192.69.537 1.38 1.026 2.04.15.21.172.48.058.7a.686.686 0 0 1-.613.38h-.03z" fill-rule="evenodd"></path>
    </svg>
  </div>
  <div class="tooltip__icon">
    <svg class="tooltip__icon__svg">
      <path d="M19.074 21.117c-1.244 0-2.432-.37-3.532-1.096a7.792 7.792 0 0 1-.703-.52c-.77.21-1.57.32-2.38.32-4.67 0-8.46-3.5-8.46-7.8C4 7.7 7.79 4.2 12.46 4.2c4.662 0 8.457 3.5 8.457 7.803 0 2.058-.85 3.984-2.403 5.448.023.17.06.35.118.55.192.69.537 1.38 1.026 2.04.15.21.172.48.058.7a.686.686 0 0 1-.613.38h-.03z" fill-rule="evenodd"></path>
    </svg>
  </div>
  <div class="tooltip__divider"></div>
  <div class="tooltip__icon">
    <svg class="tooltip__icon__svg">
      <path d="M19.074 21.117c-1.244 0-2.432-.37-3.532-1.096a7.792 7.792 0 0 1-.703-.52c-.77.21-1.57.32-2.38.32-4.67 0-8.46-3.5-8.46-7.8C4 7.7 7.79 4.2 12.46 4.2c4.662 0 8.457 3.5 8.457 7.803 0 2.058-.85 3.984-2.403 5.448.023.17.06.35.118.55.192.69.537 1.38 1.026 2.04.15.21.172.48.058.7a.686.686 0 0 1-.613.38h-.03z" fill-rule="evenodd"></path>
    </svg>
  </div>
`;

const toolTip = document.createElement("div");
toolTip.classList.add("tooltip");
toolTip.innerHTML = svgs;

const toolTipTail = document.createElement("div");
toolTipTail.classList.add("tooltip__tail");

const articleElement = document.getElementsByClassName("article")[0];

function removeTooltip() {
  if (document.body.contains(toolTip)) {
    toolTip.style.top = null;
    toolTip.style.left = null;
    toolTipTail.style.top = null;
    toolTipTail.style.left = null;
    document.body.removeChild(toolTip);
    document.body.removeChild(toolTipTail);
  }
}

let selectionQueued = false;

function displayTooltip() {
  const selection = document.getSelection();
  const anchorNode = selection.anchorNode;
  const focusNode = selection.focusNode;

  document.body.appendChild(toolTip);
  document.body.appendChild(toolTipTail);

  const toolTipWidth = toolTip.offsetWidth;
  const toolTipHeight = toolTip.offsetHeight;
  const toolTipTailWidth = toolTipTail.offsetWidth;
  const toolTipTailHeight = toolTipTail.offsetHeight;

  const rangeRects = selection.getRangeAt(0).getClientRects();

  const parentElement = selection.anchorNode.parentElement;
  const y = rangeRects[0].y;
  const x =
    rangeRects.length > 1
      ? parentElement.offsetLeft + parentElement.offsetWidth / 2
      : rangeRects[0].x + rangeRects[0].width / 2;

  toolTip.style.top = `${y - toolTipHeight - toolTipTailHeight / 2}px`;
  toolTip.style.left = `${x - toolTipWidth / 2}px`;

  toolTipTail.style.top = `${y - toolTipTailHeight / 2}px`;
  toolTipTail.style.left = `${x - toolTipTailWidth / 2}px`;
}

document.onmouseup = () => {
  if (selectionQueued) {
    displayTooltip();
  } else {
    removeTooltip();
  }
  selectionQueued = false;
};

document.addEventListener("selectionchange", function (event) {
  const selection = document.getSelection();
  if (selection.type !== "Range") {
    selectionQueued = false;
    return;
  }

  if (selection.anchorNode != selection.focusNode) {
    // Cross-paragraph selection
    selectionQueued = false;
    return;
  }

  selectionQueued = true;
});
