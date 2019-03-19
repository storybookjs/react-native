package OpenSourceProjects_Storybook.buildTypes

import jetbrains.buildServer.configs.kotlin.v2017_2.*
import jetbrains.buildServer.configs.kotlin.v2017_2.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2017_2.buildSteps.script

object OpenSourceProjects_Storybook_Test : BuildType({
    uuid = "9f9177e7-9ec9-4e2e-aabb-d304fd667711"
    id = "OpenSourceProjects_Storybook_Test"
    name = "Test"

    artifactRules = "coverage/lcov-report => coverage.zip"

    vcs {
        root(OpenSourceProjects_Storybook.vcsRoots.OpenSourceProjects_Storybook_HttpsGithubComStorybooksStorybookRefsHeadsMaster)

    }

    steps {
        script {
            name = "Test"
            scriptContent = """
                #!/bin/sh

                set -e -x

                yarn
                yarn test --core --coverage --teamcity --w2
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

    cleanup {
        artifacts(days = 1)
    }
})
