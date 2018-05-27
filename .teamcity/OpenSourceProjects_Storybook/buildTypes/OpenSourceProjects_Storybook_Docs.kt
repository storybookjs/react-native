package OpenSourceProjects_Storybook.buildTypes

import jetbrains.buildServer.configs.kotlin.v2017_2.*
import jetbrains.buildServer.configs.kotlin.v2017_2.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2017_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2017_2.triggers.vcs

object OpenSourceProjects_Storybook_Docs : BuildType({
    uuid = "1bda59b5-d08d-4fd8-b317-953e7d79d881"
    id = "OpenSourceProjects_Storybook_Docs"
    name = "Docs"

    artifactRules = "docs/public => docs.zip"

    params {
        param("Deploy branch", "release/3.4")
    }

    vcs {
        root(OpenSourceProjects_Storybook.vcsRoots.OpenSourceProjects_Storybook_HttpsGithubComStorybooksStorybookRefsHeadsMaster)

    }

    steps {
        script {
            name = "Install"
            workingDir = "docs"
            scriptContent = "yarn install --frozen-lockfile"
            dockerImage = "node:%docker.node.version%"
        }
        script {
            name = "Build"
            workingDir = "docs"
            scriptContent = "yarn build"
            dockerImage = "node:%docker.node.version%"
        }
    }

    triggers {
        vcs {
            enabled = false
        }
    }

    features {
        commitStatusPublisher {
            publisher = github {
                githubUrl = "https://api.github.com"
                authType = personalToken {
                    token = "credentialsJSON:5ffe2d7e-531e-4f6f-b1fc-a41bfea26eaa"
                }
            }
            param("github_oauth_user", "Hypnosphi")
        }
    }

    requirements {
        doesNotContain("env.OS", "Windows")
    }

    cleanup {
        artifacts(days = 1)
    }
})
