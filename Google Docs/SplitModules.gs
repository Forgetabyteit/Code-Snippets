function onOpen() {
  var ui = DocumentApp.getUi();
  // Adds a custom menu to the Google Docs UI.
  ui.createMenu('Custom Split')
      .addItem('Split Document by Modules', 'splitDocumentByModules')
      .addToUi();
}

function splitDocumentByModules() {
  var originalDoc = DocumentApp.getActiveDocument();
  var body = originalDoc.getBody();
  var elements = body.getNumChildren();
  var currentDoc = null;
  var currentBody = null;
  var inModule = false;

  for (var i = 0; i < elements; i++) {
    var element = body.getChild(i);
    var elementType = element.getType();

    // Check if we've hit a module title
    if (elementType === DocumentApp.ElementType.PARAGRAPH &&
        element.asParagraph().getHeading() !== DocumentApp.ParagraphHeading.NORMAL) {
      var text = element.asParagraph().getText();
      var moduleMatch = text.match(/Module \d+: (.+)/);

      if (moduleMatch) {
        if (currentDoc !== null) {
          currentDoc.saveAndClose();
        }
        var title = moduleMatch[0]; // This will be the full heading, e.g., "Module 1: Intro to Prompt Engineering"
        currentDoc = DocumentApp.create(title);
        currentBody = currentDoc.getBody();
        inModule = true;
        Logger.log('Created new document: ' + title);
      }
    }

    // If we're inside a module, append the copied content to the current module document.
    if (inModule && currentBody) {
      switch (elementType) {
        case DocumentApp.ElementType.PARAGRAPH:
          currentBody.appendParagraph(element.asParagraph().copy());
          break;
        case DocumentApp.ElementType.LIST_ITEM:
          currentBody.appendListItem(element.asListItem().copy());
          break;
        case DocumentApp.ElementType.TABLE:
          currentBody.appendTable(element.asTable().copy());
          break;
        // Add cases for other element types you expect to encounter.
        default:
          // Handle any other types of elements if needed.
          break;
      }
    }
  }

  // Save and close the last document if it's open.
  if (currentDoc !== null) {
    currentDoc.saveAndClose();
  }

  DocumentApp.getUi().alert('Documents have been created for each module.');
}
