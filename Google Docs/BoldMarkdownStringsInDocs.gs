// Function to create custom menu
function onOpen() {
  var ui = DocumentApp.getUi();
  ui.createMenu('Custom Menu')
      .addItem('Bold Markdown-Like Strings', 'boldStringsOptimized')
      .addToUi();
}

function boldStringsOptimized() {
  // Get the active document and its body
  var doc = DocumentApp.getActiveDocument();
  var body = doc.getBody();
  
  // Get the text in the body
  var text = body.getText();
  
  // Use regular expression to find all instances of **string**
  var re = /\*\*(.*?)\*\*/g;
  
  // Create an array to hold the ranges to be bolded
  var rangesToBold = [];
  
  // Use the exec method to find matches
  var match;
  while ((match = re.exec(text)) !== null) {
    // Get the position and the actual string to bold (without asterisks)
    var position = match.index;
    
    // Find the start position of the string with asterisks
    var start = position;
    
    // Find the end position of the string with asterisks
    var end = position + match[1].length + 3;
    
    // Push the range to be bolded to our array
    rangesToBold.push({start: start + 2, end: end - 2});  // Corrected here, end index now end - 2
  }
  
  // Batch process: Apply bold formatting
  var textEditor = body.editAsText();
  rangesToBold.forEach(function(range) {
    textEditor.setBold(range.start, range.end, true);
  });
  
  // Remove all instances of **
  body.replaceText("\\*\\*", "");
}
