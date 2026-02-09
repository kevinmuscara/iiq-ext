let settings = { ctrlKEnabled: true, disableFlyoutsEnabled: true };
chrome.storage.sync.get({ ctrlKEnabled: true, disableFlyoutsEnabled: true }, (items) => settings = items);

document.addEventListener('keydown', function(event) {
  if (settings.ctrlKEnabled && (event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault();
    document.querySelector('[data-testid=btn-global-search]').click();
  }
});

let previousUrl = window.location.href;

function checkAndRedirectFlyout() {
  if (!settings.disableFlyoutsEnabled) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const flyoutType = params.get('flyout-type');
  const flyoutId = params.get('flyout-id');
  
  if (flyoutType && flyoutId) {
    if (flyoutType === 'asset') {
      window.location.replace(`/agent/assets/${flyoutId}`);
    } else if (flyoutType === 'agent-ticket') {
      window.location.replace(`/agent/tickets/${flyoutId}`);
    } else if (flyoutType === 'agent-user') {
      window.location.replace(`/agent/users/${flyoutId}`);
    } else {
      console.log('Unknown flyout type, allowing flyout to open:', flyoutType);
    }
  }
}

checkAndRedirectFlyout();

const originalPushState = window.history.pushState;
window.history.pushState = function(...args) {
  const result = originalPushState.apply(this, args);
  setTimeout(checkAndRedirectFlyout, 0);
  return result;
};

const originalReplaceState = window.history.replaceState;
window.history.replaceState = function(...args) {
  const result = originalReplaceState.apply(this, args);
  setTimeout(checkAndRedirectFlyout, 0);
  return result;
};

window.addEventListener('popstate', () => setTimeout(checkAndRedirectFlyout, 0));

setInterval(() => {
  if (window.location.href !== previousUrl) {
    previousUrl = window.location.href;
    checkAndRedirectFlyout();
  }
}, 100);
