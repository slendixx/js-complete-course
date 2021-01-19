import { API_REQUEST_TIMEOUT } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s}  second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    const response = await Promise.race([
      fetch(url),
      timeout(API_REQUEST_TIMEOUT),
    ]);
    const data = await response.json();
    if (!response.ok) throw new Error(`${data.message} (${response.status})`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const mergeTextContent = function (newMarkup, targetParentElement) {
  const newDOM = document.createRange().createContextualFragment(newMarkup);
  const newElements = Array.from(newDOM.querySelectorAll('*'));
  const currentElements = Array.from(targetParentElement.querySelectorAll('*'));
  newElements.forEach((newEl, i) => {
    const curEl = currentElements[i];
    console.log(newEl, curEl, newEl.isEqualNode(curEl));
    if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '')
      curEl.textContent = newEl.textContent;
  });
};
