chrome.storage.sync.get({
  ctrlKEnabled: true,
  disableFlyoutsEnabled: true,
  altSEnabled: true,
  altREnabled: true,
  altCEndabled: true
}, function(items) {
  document.getElementById('ctrlKToggle').checked = items.ctrlKEnabled;
  document.getElementById('disableFlyoutsToggle').checked = items.disableFlyoutsEnabled;
  document.getElementById('altSToggle').checked = items.altSEnabled;
  document.getElementById('altRToggle').checked = items.altREnabled;
  document.getElementById('altCEToggle').checked = items.altCEndabled;
});

document.getElementById('ctrlKToggle').addEventListener('change', function() {
  chrome.storage.sync.set({ ctrlKEnabled: this.checked });
});

document.getElementById('disableFlyoutsToggle').addEventListener('change', function() {
  chrome.storage.sync.set({ disableFlyoutsEnabled: this.checked });
});

document.getElementById('altSToggle').addEventListener('change', function() {
  chrome.storage.sync.set({ altSEnabled: this.checked });
});

document.getElementById('altRToggle').addEventListener('change', function() {
  chrome.storage.sync.set({ altREnabled: this.checked });
});

document.getElementById('altCEToggle').addEventListener('change', function() {
  chrome.storage.sync.set({ altCEndabled: this.checked });
});
