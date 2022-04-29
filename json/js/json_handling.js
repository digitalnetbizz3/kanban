
  var storageName = 'data-json'
  function appLoad() {
    const urlParams = new URLSearchParams(window.location.search);
    const shareData = urlParams.get('share');
    if (shareData != null) {
      let decodedData = decodeURIComponent(shareData);
      try {
        let json = JSON.parse(decodedData);
        storageName = 'data-json-shared';
        localStorage.setItem(storageName, decodedData)
        editor.set(json)
      } catch {
        showToast('shared JSON is invalid')
      }
    } else {
      showToast('Paste or edit your JSON in the editor, it will auto-validate.')
    }
  }
