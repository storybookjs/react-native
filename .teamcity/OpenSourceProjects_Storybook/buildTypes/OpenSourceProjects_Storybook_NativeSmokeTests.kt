package OpenSourceProjects_Storybook.buildTypes

import jetbrains.buildServer.configs.kotlin.v2017_2.*
import jetbrains.buildServer.configs.kotlin.v2017_2.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2017_2.buildSteps.script

object OpenSourceProjects_Storybook_NativeSmokeTests : BuildType({
    uuid = "ac276912-df1a-44f1-8de2-056276193ce8"
    id = "OpenSourceProjects_Storybook_NativeSmokeTests"
    name = "Native Smoke Tests"

    params {
        param("env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD", "true")
    }

    vcs {
        root(OpenSourceProjects_Storybook.vcsRoots.OpenSourceProjects_Storybook_HttpsGithubComStorybooksStorybookRefsHeadsMaster)

        cleanCheckout = true
    }

    steps {
        script {
            name = "crna-kitchen-sink"
            scriptContent = """
                #!/bin/sh

                set -e -x

                yarn
                yarn bootstrap --core
                cd examples-native/crna-kitchen-sink
                yarn storybook --smoke-test
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
