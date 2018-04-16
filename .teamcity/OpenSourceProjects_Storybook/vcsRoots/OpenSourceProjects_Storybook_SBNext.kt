package OpenSourceProjects_Storybook.vcsRoots

import jetbrains.buildServer.configs.kotlin.v2017_2.*
import jetbrains.buildServer.configs.kotlin.v2017_2.vcs.GitVcsRoot

object OpenSourceProjects_Storybook_SBNext : GitVcsRoot({
    uuid = "f0bd8d49-0f6a-4859-9d26-d066af4b5d6d"
    id = "OpenSourceProjects_Storybook_SBNext"
    name = "SBNext"
    url = "git@github.com:storybooks/SBNext.git"
    branch = "refs/heads/POC-bundler"
    agentCleanPolicy = GitVcsRoot.AgentCleanPolicy.NEVER
    authMethod = uploadedKey {
        userName = "git"
        uploadedKey = "Storybook bot"
    }
})
