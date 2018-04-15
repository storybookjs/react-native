package OpenSourceProjects_Storybook.vcsRoots

import jetbrains.buildServer.configs.kotlin.v2017_2.*
import jetbrains.buildServer.configs.kotlin.v2017_2.vcs.GitVcsRoot

object OpenSourceProjects_Storybook_HttpsGithubComStorybooksStorybookRefsHeadsMaster1 : GitVcsRoot({
    uuid = "5cacf90a-381a-4c73-9aa3-57f6439b545e"
    id = "OpenSourceProjects_Storybook_HttpsGithubComStorybooksStorybookRefsHeadsMaster1"
    name = "https://github.com/storybooks/storybook#refs/heads/master (1)"
    url = "https://github.com/storybooks/storybook"
    branchSpec = "+:refs/(pull/*)/head"
    authMethod = password {
        userName = "Hypnosphi"
        password = "credentialsJSON:5ffe2d7e-531e-4f6f-b1fc-a41bfea26eaa"
    }
})
