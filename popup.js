chrome.storage.sync.get({
  ctrlKEnabled: true,
  disableFlyoutsEnabled: true
}, function(items) {
  document.getElementById('ctrlKToggle').checked = items.ctrlKEnabled;
  document.getElementById('disableFlyoutsToggle').checked = items.disableFlyoutsEnabled;
});

document.getElementById('ctrlKToggle').addEventListener('change', function() {
  chrome.storage.sync.set({ ctrlKEnabled: this.checked });
});

document.getElementById('disableFlyoutsToggle').addEventListener('change', function() {
  chrome.storage.sync.set({ disableFlyoutsEnabled: this.checked });
});
