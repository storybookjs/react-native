package OpenSourceProjects_Storybook.vcsRoots

import jetbrains.buildServer.configs.kotlin.v2017_2.*
import jetbrains.buildServer.configs.kotlin.v2017_2.vcs.GitVcsRoot

object OpenSourceProjects_Storybook_HttpsGithubComStorybooksStorybookRefsHeadsMaster : GitVcsRoot({
    uuid = "cec03c4b-d52c-42a0-8e9e-53bde85d6b33"
    id = "OpenSourceProjects_Storybook_HttpsGithubComStorybooksStorybookRefsHeadsMaster"
    name = "https://github.com/storybooks/storybook#refs/heads/master"
    url = "git@github.com:storybooks/storybook.git"
    branch = "refs/heads/next"
    branchSpec = """
        +:refs/(pull/*)/head
        +:refs/heads/*
    """.trimIndent()
    authMethod = uploadedKey {
        userName = "git"
        uploadedKey = "Storybook bot"
    }
})
