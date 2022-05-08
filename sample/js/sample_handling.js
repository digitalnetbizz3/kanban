function appLoad(appInstance) {
  app = appInstance
}

function showLoad() {
  let load_dialog = document.querySelector("#load");
  alert(load_dialog)
  load_dialog.style.display = 'block';
}

function hideLoad() {
  let load_dialog = document.querySelector("#load");
  load_dialog.style.display = 'none';
}
