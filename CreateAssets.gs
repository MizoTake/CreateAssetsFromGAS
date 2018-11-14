var targetName = 'Signboard'
var path = 'Assets/'
var githubUrl = 'https://raw.githubusercontent.com/MizoTake/CreateAssetsFromGASUnitySample/master/'

var sheet = SpreadsheetApp.openById('1KsmJTKSRGXMd1YdtJDLPzkp6xvDskaXRezc7pyq2WVQ').getSheetByName(targetName)
var github = setupGitHub()

function pushToGithub() {
  updateStrings(targetName, path)
  pushToGitHub(github)
}

function updateStrings(targetName, path) {
  var fileName = targetName + '.asset'

  var result = ""
  var idRange = sheet.getRange(2, index('id'), sheet.getLastRow(), 1).getValues()
  var nameRange = sheet.getRange(2, index('name'), sheet.getLastRow(), 1).getValues()
  var messageRange = sheet.getRange(2, index('message'), sheet.getLastRow(), 1).getValues()
  idRange.map(function(id, idIndex) {
    id.map(function(item, index) {
      if (item != "" && typeof item !== undefined) {
        result += "  - id: " + item + "\n"
        result += "    name:\"" + escape(nameRange[idIndex]).split('%').join('\\') + "\"\n"
        result += "    message: \"" + escape(messageRange[idIndex]).split('%').join('\\') + "\"\n"
      }
    });
  });
  
  addCommitData(path + fileName, result, github)
}

function index(target) {
  var contentTitles = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
  return contentTitles.indexOf(target) + 1
}

// add user property from code
function setup() {
  var prop = PropertiesService.getUserProperties();
  prop.setProperty('NAME', '');
  prop.setProperty('EMAIL', '');
  prop.setProperty('GITHUB_TOKEN', '');
}