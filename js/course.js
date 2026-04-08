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
    setupEditor('editor-basics','preview-basics');
    setupEditor('editor-heading','preview-heading');
    setupEditor('editor-para','preview-para');
    setupEditor('editor-hr','preview-hr');
    setupEditor('editor-comment','preview-comment');
    setupEditor('editor-element','preview-element');
    setupEditor('editor-nestedelement','preview-nestedelement');
    setupEditor('editor-endtag','preview-endtag');
    setupEditor('editor-empty','preview-empty');
    setupEditor('editor-attribute','preview-attribute');
    setupEditor('editor-alt','preview-alt');
    setupEditor('editor-width','preview-width');
    setupEditor('editor-id','preview-id');
    setupEditor('editor-titlee','preview-titlee');
    setupEditor('editor-hre','preview-hre');
    setupEditor('editor-bl','preview-bl');
    setupEditor('editor-bloc','preview-bloc');
    setupEditor('editor-inli','preview-inli');
    setupEditor('editor-headings','preview-headings');
    setupEditor('editor-format','preview-format');
    setupEditor('editor-hyper','preview-hyper');
    setupEditor('editor-li_ex','preview-li_ex');
    setupEditor('editor-ol', 'preview-ol');
    setupEditor('editor-n_ol', 'preview-n_ol');
    setupEditor('editor-ul', 'preview-ul');
    setupEditor('editor-dl', 'preview-dl');
    setupEditor('editor-ifr', 'preview-ifr');
    setupEditor('editor-ifr1', 'preview-ifr1');
    setupEditor('editor-ifr2', 'preview-ifr2');
    setupEditor('editor-ifr3', 'preview-ifr3');
    setupEditor('editor-forms', 'preview-forms');
    setupEditor('editor-parag', 'preview-parag');
    setupEditor('editor-break', 'preview-break');
    setupEditor('editor-audi','preview-audi');
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
showContent('tasks');
function setupEditor(editorId, previewId) {
    const editorTextarea = document.getElementById(editorId);
    const previewFrame = document.getElementById(previewId);
    const editor = CodeMirror.fromTextArea(editorTextarea, {
        lineNumbers: true,
        mode: 'htmlmixed',
        theme: 'material-darker',
        lineWrapping: true,
    });
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