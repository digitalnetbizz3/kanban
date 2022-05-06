
class app_chooser {
    static name = 'app-chooser'
  
    static componentLoad() {
      window._app.component(app_chooser.name, {
        template: `
        <div id="chooseModal" class="modal fade">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content" style="width:800px;">
                    <div class="modal-header bg-primary">
                        <div class="h4 modal-title text-light">Applications</div>
                        <button type="button" class="btn-close text-light" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col border rounded p-2 me-2">
                                <img src="/assets/kanban.png" alt="Kanban Board" style="margin-left:35px;cursor:hand;width:150px; height:150px;" onclick="handleChooser('kanban');"/>
                                <div class="h6" style="text-align:center;">Kan-ban board</div>
                            </div>
                            <div class="col border rounded p-2">
                                <img src="/assets/sequence.png" alt="Sequence Diagram" style="margin-left:35px;cursor:hand;width:150px; height:150px;"  onclick="handleChooser('sequence');"/>
                                <div class="h6" style="text-align:center;">Sequence Diagram</div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col border rounded p-2 me-2">
                                <img src="/assets/flowchart.png" alt="Kanban Board" style="margin-left:35px;cursor:hand;width:150px; height:150px;" onclick="handleChooser('flowchart');"/>
                                <div class="h6" style="text-align:center;">Flowchart Diagram</div>
                            </div>
                            <div class="col border rounded p-2">
                                <img src="/assets/statetransition.png" alt="Sequence Diagram" style="margin-left:35px;cursor:hand;width:150px; height:150px;" onclick="handleChooser('state');"/>
                                <div class="h6" style="text-align:center;">State Transition</div>
                            </div>
                        </div>
                    </div>      
                    <div class="modal-body">
                        <div class="row">
                            <div class="col border rounded p-2 me-2">
                                <img src="/assets/class.png" alt="Class Diagram" style="margin-left:35px;cursor:hand;width:150px; height:150px;" onclick="handleChooser('class');"/>
                                <div class="h6" style="text-align:center;">Class Diagram</div>
                            </div>                            
                            <div class="col border rounded p-2 me-2">
                                <img src="/assets/json.png" alt="JSON Validator" style="margin-left:35px;cursor:hand;width:150px; height:150px;" onclick="handleChooser('json');"/>
                                <div class="h6" style="text-align:center;">JSON Validator</div>
                            </div>
                        </div>
                    </div>                                  
                    <div class="modal-footer h6">
                        Choose an application from options above or click anywhere else to dismiss
                    </div>
                </div>
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
  }
    
  registerComponent(app_chooser)