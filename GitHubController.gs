var commitData = []

var branchName = 'feature/gas'

function setupGitHub() {
  var prop = PropertiesService.getUserProperties()
  var option = { name:prop.getProperty('NAME') , email:prop.getProperty('EMAIL') }
  return new GitHubAPI.GitHubAPI('MizoTake', 'CreateAssetsFromGASUnitySample', prop.getProperty('GITHUB_TOKEN'), option)
}

function pushToGitHub(github) {
  const date = new Date()
  createCommit(github)
  createPullRequest(date, github)
}

function addCommitData(filePath, blobData, github) {
  var txtBlob = UrlFetchApp.fetch(githubUrl + filePath)
  var index = txtBlob.getContentText().lastIndexOf('flow:')
  // flow: + 改行コード = 6
  var deleteTarget = txtBlob.getContentText().slice(index + 6)
  var header = txtBlob.getContentText().replace(deleteTarget, '')

  var blob = github.createBlob(header + blobData)
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
  var data = {
    'base_tree': pTree['sha'],
    'tree': commitData
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
    return github.createPullRequest(title, branchName, 'master')
  } catch (error) {
    Logger.log(error)
  }
}