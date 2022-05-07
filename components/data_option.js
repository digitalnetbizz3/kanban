class data_option {
    static name = 'data-option'
  
    static componentLoad() {
      gapp.component(data_option.name, {
        props: {
          label: String, 
          stores: [String],
          hasmarkdown: String,
          hasheader: String,
          vroot: String,
          prefix: String
        },
        created() {
            
        },        
        template: `
            <div class="load_root">
                <div class="card">
                    <div v-if="hasheader == 'true'" class="card-header">
                        Data Option
                        <button type="button" class="btn-close  float-end  text-light" onclick="hideLoad()"></button>
                    </div>
                    
                    <div class="card-body h6 m-1">
                        There are 5 slots which means you can work on 4 different {{label}}, 1 shareable from URL and switching between them.
                        <hr>
                        <select id="storageOptions" onchange="changeDataStorage()" size="5" class="form-select">
                        <option v-for="store in stores" :value="store">{{store}}</option>
                    </select>
                    <hr>
                    Sequence data for selected slot
                    <textarea id="data_text" class="form-select" style="font-size:8pt;height:200px;resize: none;"></textarea>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-primary mw-30" onclick="resetData()" 
                            aria-label="Reset Diagram" title="Reset Diagram">
                        Reset
                        </button>   
                        <button class="btn btn-primary mw-30 ms-1" onclick="updateData()" 
                            aria-label="Update Diagram" title="Update Diagram">
                        Update
                        </button>   
                        <button class="btn btn-primary mw-30 ms-1" :data="vroot" onclick="copyData(this)" 
                            aria-label="Share Diagram as URL" title="Share Diagram as URL">
                        Share
                        </button>                                           
                    </div>
                </div>
                <div class="card">
                    <div class="card-body h6 m-1">
                        Pick a format to download and click 'Download' button.
                        <hr>
                        <div class="btn-group w-100" role="group" aria-label="download option">
                            <input class="btn-check" type="radio" id="download_json" name="downloadType" value="download_json">
                            <label class="btn btn-outline-secondary" for="download_json">JSON</label>
                            <input v-if="hasmarkdown == 'true'" class="btn-check" type="radio" id="download_mermaid" name="downloadType" value="download_json">
                            <label v-if="hasmarkdown == 'true'" class="btn btn-outline-secondary" for="download_mermaid">Mermaid Markdown</label>                                    
                            <input class="btn-check" type="radio" name="downloadType" id="download_png" value="download_png" checked>
                            <label class="btn btn-outline-secondary" for="download_png">PNG</label>
                        </div>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-primary w-100" :data="prefix" onclick="downloadData(this)" 
                            aria-label="Download" title="Download">
                        Download
                        </button>  
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
    
  registerComponent(data_option)

  function resetData() {
    app.reset()
    updateDiagram()
  }
  
  function updateData() {
    let kanban_data = document.querySelector("#data_text");
    try {
        let update_json = JSON.parse(kanban_data.value);
        app.update(update_json);
        updateDiagram()
    } catch {
        toast_dialog.show('Invalid JSON data.');
    }
  }

  function copyData(el) {
    let vroot = el.getAttribute('data')
    let jsonText = app.getLeanJSON();
    const lib = JsonUrl('lzma');
    lib.compress(jsonText).then(output => { 
      let urlToShare = "https://kan-ban.org/" + vroot + "?share=" + output;
      navigator.clipboard.writeText(urlToShare).then(
          function () {
            toast_dialog.show("Sharable URL copy into clipboard, you can share URL with someone else and they will see your Kanban board.");
          }
      );
    });
  }


  function downloadData(el) {
    let prefix = el.getAttribute('data')
    let filePrefix = "my-" + prefix
    let jsonOption = document.querySelector('#download_json');
    let mermaidOption = document.querySelector('#download_mermaid');
    var dataUrl = null;
    var fileName = null;

    if(jsonOption.checked) {
      fileName = filePrefix + '.json';
      let localData = localStorage.getItem(storageName);
      dataUrl = "data:text/json;charset=utf-8," + encodeURIComponent(localData);
    }
    else if (mermaidOption != null && mermaidOption.checked) {
      fileName = filePrefix + '.md';
      let localData = app.getMarkDown();
      dataUrl = "data:text/json;charset=utf-8," + encodeURIComponent(localData);
    } else {
      domtoimage
        .toPng(document.getElementById('diagram'), { quality: 1 })
        .then(function (url) {
          var link = document.createElement("a");
          link.download = filePrefix + ".png";
          link.href = url;
          link.click();
        });
      return;
    }
    if (dataUrl != null) {
      var link = document.createElement("a");
      link.download = fileName;
      link.href = dataUrl;
      link.click();  
    }
  }

  function changeDataStorage() {
    let storageLocation = document.querySelector("#storageOptions");
    storageName = storageLocation.value;
    app.changeStorage();
    updateDiagram();

    let kanban_data = document.querySelector("#data_text");
    kanban_data.value = app.getJSON();
  }
