
class toast_dialog {

  static name = 'toast-dialog'

  static componentLoad() {
    window._app.component(toast_dialog.name, {
      template: `
      <div id='toast' class="toast bottom-0 end-0" data-bs-delay="5000" style="position:absolute;z-index:99;" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-header">
              <strong class="me-auto">Kanban</strong>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div id="toast_msg" class="toast-body">
          </div>
      </div>
      `,
      data() {
        return {
          open: false,
        };
      },
    });
  }

  static show(msg) {
    document.getElementById('toast_msg').innerText = msg;
    let toast = bootstrap.Toast.getOrCreateInstance(document.getElementById('toast'))
    toast.show();
  }
}

registerComponent(toast_dialog)