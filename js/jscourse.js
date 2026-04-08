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
    setupEditor('editor-introduction', 'preview-introduction');
    setupEditor('editor-basic-style','preview-basic-style');
    setupEditor('editor-inclusion-methods','preview-inclusion-methods');
    setupEditor('editor-selectors','preview-selectors');
    setupEditor('editor-text-formatting','preview-text-formatting');
    setupEditor('editor-color-properties','preview-color-properties');
    setupEditor('editor-box-model','preview-box-model');
    setupEditor('editor-box-model-details','preview-box-model-details');
    setupEditor('editor-box-model-details','preview-box-model-details');
    setupEditor('editor-element-dimensions','preview-element-dimensions');
    setupEditor('editor-box-sizing','preview-box-sizing');
    setupEditor('editor-display-properties','preview-display-properties');
    setupEditor('editor-positioning-elements','preview-positioning-elements');
    setupEditor('editor-z-index','preview-z-index');
    setupEditor('editor-flexbox','preview-flexbox');
    setupEditor('editor-grid','preview-grid');
    setupEditor('editor-transforms','preview-transforms');
    setupEditor('editor-transitions','preview-transitions');
    setupEditor('editor-animations','preview-animations');
    setupEditor('editor-responsive','preview-responsive'); 
    setupEditor('editor-mediaquery','preview-mediaquery');
    setupEditor('editor-devicespecific','preview-devicespecific');
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
    const storageKey = `saved-${editorId}`;
    if (!editorTextarea || editorTextarea.classList.contains('cm-initialized')) {
        return;
    }

    const editor = CodeMirror.fromTextArea(editorTextarea, {
        lineNumbers: true,
        mode: 'htmlmixed',
        theme: 'material-darker',
        lineWrapping: true,
        viewportMargin: Infinity,
    });
    const savedContent = localStorage.getItem(storageKey);
    if (savedContent) {
        editor.setValue(savedContent);
    }

    editorTextarea.classList.add('cm-initialized');

    function syncEditorHeight() {
        const lineCount = editor.lineCount();
        const lineHeight = 17; 
        const padding = 20; 
        const newHeight = lineCount * lineHeight + padding;
        editor.getWrapperElement().style.height = Math.max(newHeight, 100) + 'px';
        editor.refresh(); 
    }

    function updatePreview() {
        localStorage.setItem(storageKey, editor.getValue());

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
            previewFrame.style.height = Math.max(contentHeight + 20, 100) + 'px';
        }, 100);
    }

    updatePreview();
    syncEditorHeight();

    editor.on('change', () => {
        updatePreview();
        syncEditorHeight();
    });
}