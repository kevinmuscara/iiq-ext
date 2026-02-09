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
