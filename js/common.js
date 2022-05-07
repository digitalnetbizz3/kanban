 
  function positionAdorner(rect) {
    const padding = 5;
    let adorner = document.getElementById("selection_adorner");
    adorner.style.position = 'absolute';
    adorner.style.display = 'block';
    adorner.style.width = (rect.width + 2 * padding) + 'px';
    adorner.style.height = (rect.height + 2 * padding) + 'px';
    adorner.style.top = (rect.y + window.scrollY) - padding + 'px';
    adorner.style.left = (rect.x + window.scrollX - padding) + 'px';

    let editor = document.getElementById("selection_editor");
    editor.style.display = 'block';
    editor.style.top = rect.y + window.scrollY - padding + 'px';
    editor.style.left = (rect.x + rect.width + (2 * padding) + window.scrollX) + 'px';
  }