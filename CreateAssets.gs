var targetName = 'Signboard'
var path = 'Assets/sLowZoo/Data/MessageSection/'

var github = setupGitHub()

function pushToGithub() {
  updateStrings(targetName, localizablePath)
  pushToGitHub(github)
}

function updateStrings(targetName, path) {
  var sheet = SpreadsheetApp.openById('1KsmJTKSRGXMd1YdtJDLPzkp6xvDskaXRezc7pyq2WVQ').getSheetByName(targetName)
  var fileName = targetName + '.asset'

  var result = ""
  var id = targetSheet.getRange(2, idIndex(targetSheet), targetSheet.getLastRow(), 1).getValues()
  var names = targetSheet.getRange(2, nameIndex(targetSheet), targetSheet.getLastRow(), 1).getValues()
  var message = targetSheet.getRange(2, messageIndex(targetSheet), targetSheet.getLastRow(), 1).getValues()
  names.map(function(name, namesIndex) {
    name.map(function(item, index) {
      if (!(item == "" || typeof item === "undefined")) {
        result += "  - id: " + id[namesIndex] + "\n"
        result += "    name:\"" + item + "\"\n"
        result += "    message: \"" + message[namesIndex] + "\"\n"
      }
    });
  });
  
  addCommitData(path + fileName, result, github)
}

function idIndex(targetSheet) {
  var contentTitles = targetSheet.getRange(1, 1, 1, targetSheet.getLastColumn()).getValues()[0]
  return contentTitles.indexOf('id') + 1
}

function nameIndex(targetSheet) {
  var contentTitles = targetSheet.getRange(1, 1, 1, targetSheet.getLastColumn()).getValues()[0]
  return contentTitles.indexOf('name') + 1
}

function messageIndex(targetSheet) {
  var contentTitles = targetSheet.getRange(1, 1, 1, targetSheet.getLastColumn()).getValues()[0]
  return contentTitles.indexOf('message') + 1
}


// add user property from code
function setup() {
  var prop = PropertiesService.getUserProperties();
  prop.setProperty('NAME', '');
  prop.setProperty('EMAIL', '');
  prop.setProperty('GITHUB_TOKEN', '');
}