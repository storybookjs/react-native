package OpenSourceProjects_Storybook.vcsRoots

import jetbrains.buildServer.configs.kotlin.v2017_2.*
import jetbrains.buildServer.configs.kotlin.v2017_2.vcs.GitVcsRoot

object OpenSourceProjects_Storybook_SBNext : GitVcsRoot({
    uuid = "f0bd8d49-0f6a-4859-9d26-d066af4b5d6d"
    id = "OpenSourceProjects_Storybook_SBNext"
    name = "SBNext"
    url = "https://github.com/storybooks/SBNext"
    branch = "refs/heads/POC-bundler"
    authMethod = password {
        userName = "Hypnosphi"
        password = "credentialsJSON:5ffe2d7e-531e-4f6f-b1fc-a41bfea26eaa"
    }
})
