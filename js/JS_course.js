// function toggleSubmenu(clickedItem) {
//   const submenu = clickedItem.nextElementSibling;
//   const arrow = clickedItem.querySelector(".arrow");

//   const isVisible = submenu.style.display === "block";
//   submenu.style.display = isVisible ? "none" : "block";
//   arrow.textContent = isVisible ? "▼" : "▲";
// }
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
    // --- Show the first content section by default ---
    showContent('introduction');
});

// --- Function to toggle sidebar submenus ---
// function toggleSubmenu(clickedItem) {
//     const submenu = clickedItem.querySelector(".submenu");
//     const arrow = clickedItem.querySelector(".arrow");

//     if (submenu.style.display === "block") {
//         submenu.style.display = "none";
//         arrow.style.transform = "rotate(0deg)";
//     } else {
//         submenu.style.display = "block";
//         arrow.style.transform = "rotate(180deg)";
//     }
// }

// --- Function to show a content section and hide others ---
function showContent(contentId) {
    const contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach(section => {
        section.style.display = 'none';
    });

    const selectedContent = document.getElementById(contentId);
    if (selectedContent) {
        selectedContent.style.display = 'block';
        // Refresh CodeMirror instances inside the visible section
        // This fixes a bug where the editor is invisible until clicked
        const editors = selectedContent.querySelectorAll('.CodeMirror');
        editors.forEach(editorNode => {
            if (editorNode.CodeMirror) {
                editorNode.CodeMirror.refresh();
            }
        });
    }
}

// --- Function to initialize a CodeMirror editor and link it to a preview iframe ---
function setupEditor(editorId, previewId) {
    const editorTextarea = document.getElementById(editorId);
    const previewFrame = document.getElementById(previewId);
    // const storageKey = `saved-${editorId}`;
    if (editorTextarea.classList.contains('cm-initialized')) return;


    const editor = CodeMirror.fromTextArea(editorTextarea, {
        lineNumbers: true,
        mode: 'htmlmixed',
        theme: 'material-darker',
        lineWrapping: true,
        viewportMargin: Infinity,
    });
    // const savedContent = localStorage.getItem(storageKey);
    // if (savedContent) {
    //     editor.setValue(savedContent);
    // }
    editorTextarea.classList.add('cm-initialized');
    function syncEditorHeight() {
    const lineCount = editor.lineCount();
    const lineHeight = 17;
    const padding = 20;
    const newHeight = lineCount * lineHeight + padding;

    editor.getWrapperElement().style.height = newHeight + 'px';
  }
  
    function updatePreview() {
        // const code = editor.getValue();
        // localStorage.setItem(storageKey, code);
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

function toggleSubmenu(clickedItem) {
  const submenu = clickedItem.nextElementSibling;
  const arrowIcon = clickedItem.querySelector(".arrow i");

  const isVisible = submenu.style.display === "block";
  submenu.style.display = isVisible ? "none" : "block";
//   arrow.textContent = isVisible ? "▼" : "▲";
  if (arrowIcon) {
    arrowIcon.classList.toggle("fa-chevron-up", !isVisible);
    arrowIcon.classList.toggle("fa-chevron-down", isVisible);
  }
}