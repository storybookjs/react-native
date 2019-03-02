workflow "Dangerfile JS Pull" {
  on = "pull_request"
  resolves = "Danger JS"
}

workflow "Dangerfile JS Label" {
  on = "label"
  resolves = "Danger JS"
}

action "Danger JS" {
  uses = "danger/danger-js@master"
  secrets = ["GITHUB_TOKEN"]
  args = "--dangerfile .ci/danger/dangerfile.ts"
}