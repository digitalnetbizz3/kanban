
  var storageName = 'data-json'
  function appLoad() {
    const urlParams = new URLSearchParams(window.location.search);
    const shareData = urlParams.get('share');
    if (shareData != null) {
      const lib = JsonUrl('lzma');
      lib.decompress(shareData).then(output => { 
        try {
          JSON.parse(output);
          storageName = 'data-json-shared';
          localStorage.setItem(storageName, output)
          app.changeStorage();
        } catch(e) {
          console.log(e)
          showToast('shared JSON is invalid')
        }
      })
    } else {
      showToast('Paste or edit your JSON in the editor, it will auto-validate.')
    }
  }
