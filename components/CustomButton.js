function componentLoad() {
  window._app.component('toast-dialog', {
    template: `
    <div id='toast2' class="toast bottom-0 end-0" data-bs-delay="5000" style="position:absolute;z-index:99;" role="alert" aria-live="assertive" aria-atomic="true">
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
  })
}