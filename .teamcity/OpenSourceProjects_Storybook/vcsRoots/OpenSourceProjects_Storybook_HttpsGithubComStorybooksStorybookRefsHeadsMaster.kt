package OpenSourceProjects_Storybook.vcsRoots

import jetbrains.buildServer.configs.kotlin.v2017_2.*
import jetbrains.buildServer.configs.kotlin.v2017_2.vcs.GitVcsRoot

object OpenSourceProjects_Storybook_HttpsGithubComStorybooksStorybookRefsHeadsMaster : GitVcsRoot({
    uuid = "cec03c4b-d52c-42a0-8e9e-53bde85d6b33"
    id = "OpenSourceProjects_Storybook_HttpsGithubComStorybooksStorybookRefsHeadsMaster"
    name = "https://github.com/storybooks/storybook#refs/heads/master"
    url = "https://github.com/storybooks/storybook"
    branchSpec = """
        +:refs/(pull/*)/merge
        +:refs/heads/(release/3.4)
        +:refs/heads/(master)
    """.trimIndent()
    authMethod = password {
        userName = "Hypnosphi"
        password = "credentialsJSON:5ffe2d7e-531e-4f6f-b1fc-a41bfea26eaa"
    }
})
