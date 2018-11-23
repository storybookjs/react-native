package OpenSourceProjects_Storybook.buildTypes

import jetbrains.buildServer.configs.kotlin.v2017_2.*
import jetbrains.buildServer.configs.kotlin.v2017_2.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2017_2.buildSteps.script

object OpenSourceProjects_Storybook_SmokeTests : BuildType({
    uuid = "1ea2b5bd-28f6-44f5-8ab3-6c659ce8fbd6"
    id = "OpenSourceProjects_Storybook_SmokeTests"
    name = "Smoke tests"

    vcs {
        root(OpenSourceProjects_Storybook.vcsRoots.OpenSourceProjects_Storybook_HttpsGithubComStorybooksStorybookRefsHeadsMaster)

    }

    steps {
        script {
            name = "Install"
            scriptContent = "yarn"
            dockerImage = "node:%docker.node.version%"
        }
        allApps {
            if (merged) {
                script {
                    name = appName
                    scriptContent = """
                        #!/bin/sh

                        set -e -x

                        cd examples/$exampleDir
                        yarn storybook --smoke-test --quiet
                    """.trimIndent()
                    dockerImage = "node:%docker.node.version%"
                }
            }
        }
        script {
            name = "official-storybook"
            scriptContent = """
                #!/bin/sh

                set -e -x

                cd examples/official-storybook
                yarn storybook --smoke-test --quiet
            """.trimIndent()
            dockerImage = "node:%docker.node.version%"
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

    dependencies {
        dependency(OpenSourceProjects_Storybook.buildTypes.OpenSourceProjects_Storybook_Bootstrap) {
            snapshot {
                onDependencyFailure = FailureAction.FAIL_TO_START
            }

            artifacts {
                artifactRules = "dist.zip!**"
            }
        }
    }

    requirements {
        doesNotContain("env.OS", "Windows")
    }
})
