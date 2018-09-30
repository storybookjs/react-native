package OpenSourceProjects_Storybook.buildTypes

import jetbrains.buildServer.configs.kotlin.v2017_2.*
import jetbrains.buildServer.configs.kotlin.v2017_2.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2017_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2017_2.triggers.vcs
import jetbrains.buildServer.configs.kotlin.v2017_2.triggers.retryBuild
import jetbrains.buildServer.configs.kotlin.v2017_2.triggers.VcsTrigger

object OpenSourceProjects_Storybook_CliTestLatestCra : BuildType({
    uuid = "d4320bd8-6094-4dd6-9bed-e13d6f0d12e2"
    id = "OpenSourceProjects_Storybook_CliTestLatestCra"
    name = "CLI test, latest CRA"

    vcs {
        root(OpenSourceProjects_Storybook.vcsRoots.OpenSourceProjects_Storybook_HttpsGithubComStorybooksStorybookRefsHeadsMaster)

    }

    steps {
        script {
            name = "Bootstrap"
            scriptContent = """
                set -e -x

                yarn
                yarn bootstrap --core
            """.trimIndent()
            dockerImage = "node:%docker.node.version%"
        }
        script {
            name = "Test"
            scriptContent = "yarn test-latest-cra"
            dockerImage = "node:%docker.node.version%"
        }
    }

    triggers {
        vcs {
            quietPeriodMode = VcsTrigger.QuietPeriodMode.USE_DEFAULT
            triggerRules = "-:comment=^TeamCity change:**"
        }
        retryBuild {}
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
