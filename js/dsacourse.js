
function toggleSubmenu(clickedItem) {
  const submenu = clickedItem.nextElementSibling;
  const arrowIcon = clickedItem.querySelector(".arrow i");

  const isVisible = submenu.style.display === "block";
  submenu.style.display = isVisible ? "none" : "block";
  if (arrowIcon) {
    arrowIcon.classList.toggle("fa-chevron-up", !isVisible);
    arrowIcon.classList.toggle("fa-chevron-down", isVisible);
  }
}

document.addEventListener('DOMContentLoaded', function() {
    showContent('introduction');
});


function showContent(contentId) {
    const contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach(section => {
        section.style.display = 'none';
    });

    const selectedContent = document.getElementById(contentId);
    if (selectedContent) {
        selectedContent.style.display = 'block';
        const editors = selectedContent.querySelectorAll('.CodeMirror');
        editors.forEach(editorNode => {
            if (editorNode.CodeMirror) {
                editorNode.CodeMirror.refresh();
            }
        });
    }
}


function setupEditor(editorId, previewId) {
    const editorTextarea = document.getElementById(editorId);
    const previewFrame = document.getElementById(previewId);
    if (editorTextarea.classList.contains('cm-initialized')) return;


    const editor = CodeMirror.fromTextArea(editorTextarea, {
        lineNumbers: true,
        mode: 'htmlmixed',
        theme: 'material-darker',
        lineWrapping: true,
        viewportMargin: Infinity,
    });
    editorTextarea.classList.add('cm-initialized');
    function syncEditorHeight() {
    const lineCount = editor.lineCount();
    const lineHeight = 17;
    const padding = 20;
    const newHeight = lineCount * lineHeight + padding;

    editor.getWrapperElement().style.height = newHeight + 'px';
  }
  
    function updatePreview() {
       
        const previewDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
        previewDoc.open();
        const baseStyles = `
            <style>
                body { 
                    font-family: sans-serif; 
                    padding: 10px; 
                    margin: 0;
                }
            </style>
        `;
        previewDoc.write(baseStyles + editor.getValue());
        previewDoc.close();
        setTimeout(() => {
            const contentHeight = previewDoc.body.scrollHeight;
            previewFrame.style.height = (contentHeight + 20) + 'px';
        }, 100);
    }
    
    updatePreview();         
    syncEditorHeight();  

    editor.on('change', () => {
    updatePreview();      
    syncEditorHeight();     
  });     
}