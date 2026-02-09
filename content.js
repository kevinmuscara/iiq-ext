let settings = { 
  ctrlKEnabled: true,
  disableFlyoutsEnabled: true,
  altSEnabled: true,
  altREnabled: true,
  altCEndabled: true
};

chrome.storage.sync.get({
  ctrlKEnabled: true,
  disableFlyoutsEnabled: true,
  altSEnabled: true, 
  altREnabled: true, 
  altCEndabled: true 
}, (items) => settings = items);

document.addEventListener('keydown', function(event) {
  if (settings.ctrlKEnabled && (event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault();
    document.querySelector('[data-testid=btn-global-search]').click();
  }

  if(settings.altSEnabled && (event.altKey && event.key == 'ß')) {
    event.preventDefault();

    let issue_spare = document.querySelector(`[ng-click="$ctrl.IssueSpare()"]`);
    let return_spare = document.querySelector(`[ng-click="$ctrl.ReturnSpare()"]`);

    if(issue_spare) {
      issue_spare.click();
      setTimeout(() => {
        document.querySelector(`[ng-click="$select.clear($event)"]`).click();
      }, 1500);
    } else if(return_spare) { 
      return_spare.click();
    }
  }

  if(settings.altREnabled && (event.altKey && event.key == '®')) {
    event.preventDefault();

    let confirm_button = document.querySelector(`[ng-click="$ctrl.onConfirmIssueClick($ctrl.SetIssueConfirmed)"]`);
    if(confirm_button == null) {
      document.querySelector(`[class="btn-resolve-ticket btn btn-primary"]`).click();
    } else {
      confirm_button.click();
      document.querySelector(`[class="btn-resolve-ticket btn btn-primary"]`).click();
    }
  }

  if(settings.altCEndabled && (event.altKey && event.key == 'ç')) {
    event.preventDefault();
    document.querySelector(`[ng-click="$ctrl.onConfirmIssueClick($ctrl.SetIssueConfirmed)"]`).click();
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
}, 500);

const add_copy_button = (element) => {
  if (element.classList.contains('copied-button-added')) {
    return;
  }

  const anchor = document.createElement('a');
  anchor.className = 'btn btn-default btn-xs margin-left-10 top-n3 position-relative copied-button';
  anchor.innerHTML = '<i class="fa fa-paperclip"></i><span class="copied-text">Copied!</span>';
  anchor.setAttribute('uib-tooltip', 'Copy');

  anchor.style.display = 'inline-flex';
  anchor.style.alignItems = 'center';
  anchor.style.overflow = 'hidden';
  anchor.style.whiteSpace = 'nowrap';
  anchor.style.maxWidth = '34px';
  anchor.style.transition = 'max-width 0.3s ease';
  anchor.style.minWidth = '14.125px';

  const copiedText = anchor.querySelector('.copied-text');
  copiedText.style.opacity = '0';
  copiedText.style.transition = 'opacity 0.3s ease, padding-left 0.3s ease';
  copiedText.style.paddingLeft = '0';
  copiedText.style.textTransform = 'none';

  anchor.addEventListener('click', () => {
    const value = element.textContent;
    navigator.clipboard.writeText(value);

    anchor.style.maxWidth = '120px';
    copiedText.style.opacity = '1';
    copiedText.style.paddingLeft = '5px';

    setTimeout(() => {
      copiedText.style.opacity = '0';
      copiedText.style.paddingLeft = '0px';
      anchor.style.maxWidth = '34px';
    }, 3000);
  });

  element.parentNode.insertBefore(anchor, element.nextSibling);
  element.classList.add('copied-button-added');
}

const asset_and_serial = () => {
   const elements = document.querySelectorAll('span[ng-bind="$ctrl.Asset.AssetTag"]:not(.copied-button-added), span[ng-bind="$ctrl.Asset.SerialNumber"]:not(.copied-button-added)');
   elements.forEach(add_copy_button);
}

const change_title = () => {
  const ticket_number = document.querySelector('div.ticket-detail span[ng-bind="$ctrl.Ticket.TicketNumber"]');
  if(!ticket_number) {
    const asset_tag = document.querySelector(`[ng-bind="$ctrl.Asset.AssetTag"]`);
    if(!asset_tag) {
      return;
    }
    document.title = `#${asset_tag.textContent}`;
    return;
  }

  document.title = `#${ticket_number.textContent}`;
}

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