var commitData = []

var branchName = 'feature/gas'

function setupGitHub() {
  var prop = PropertiesService.getUserProperties()
  var option = { name:prop.getProperty('NAME') , email:prop.getProperty('EMAIL') }
  return new GitHubAPI.GitHubAPI('MizoTake', 'sLowZoo', prop.getProperty('GITHUB_TOKEN'), option)
}

function pushToGitHub(github) {
  const date = new Date()
  createCommit(github)
  createPullRequest(date, github)
}

function addCommitData(filePath, blobData, github) {
  var blob = github.createBlob(blobData)
  commitData.push({
      'path': filePath,
      'mode': '100644',
      'type': 'blob',
      'sha': blob['sha']
    })
}

function createCommit(github) {  
  var branch = github.getBranch(branchName)
  var pTree = github.getTree(branch['commit']['commit']['tree']['sha'])
  var origin = pTree['tree']
  commitData.map(function(item, index) {
    if (origin.indexOf(item) != -1) {
      origin.splice(index, 1)
    }
  })
  var data = {
    'tree': origin.concat(commitData)
  }
  var tree = github.createTree(data)
  var commit = github.createCommit('new GSS Data', tree['sha'], branch['commit']['sha'])
  var result = github.updateReference(branchName, commit['sha'])
}

// プルリクがあるとエラーのためめんどくさいからtry catch
function createPullRequest(date, github) {
  try {
    const previousDay = new Date(date.getTime() + 24 * 60 * 60 * 1000)
    var title = Utilities.formatDate(previousDay, Session.getScriptTimeZone(), "yyyy/M/d")
    return github.createPullRequest(title, branchName, 'develop')
  } catch (error) {
    Logger.log(error)
  }
}