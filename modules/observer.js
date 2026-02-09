const debounce = (func, wait) => {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  }
}

const copy_observer = new MutationObserver(debounce(asset_and_serial, 250));
copy_observer.observe(document.body, { childList: true, subtree: true });

const title_observer = new MutationObserver(debounce(change_title, 250));
title_observer.observe(document.body, { childList: true, subtree: true });

window.addEventListener('load', () => {
  setTimeout(asset_and_serial, 1000);
  setTimeout(change_title, 1000);
});
