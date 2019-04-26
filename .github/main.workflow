action "Danger JS" {
  uses = "danger/danger-js@master"
  secrets = ["GITHUB_TOKEN"]
  args = "--dangerfile .ci/danger/dangerfile.ts"
}

workflow "Dangerfile JS Pull" {
  on = "pull_request"
  resolves = "Danger JS"
}

workflow "Dangerfile JS Label" {
  on = "label"
  resolves = "Danger JS"
}

# ===

action "Automention" {
  uses = "shilman/automention@master"
  secrets = ["GITHUB_TOKEN"]
}

workflow "Automention Issues" {
  on = "issues"
  resolves = "Automention"
}

workflow "Automention PRs" {
  on = "pull_request"
  resolves = "Automention"
}