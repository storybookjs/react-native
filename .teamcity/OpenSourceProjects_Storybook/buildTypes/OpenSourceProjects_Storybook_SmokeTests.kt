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
            name = "Bootstrap"
            scriptContent = """
                yarn
                yarn bootstrap --core
            """.trimIndent()
            dockerImage = "node:latest"
        }
        script {
            name = "angular-cli"
            scriptContent = """
                #!/bin/sh

                set -e -x

                cd examples/angular-cli
                yarn storybook --smoke-test
            """.trimIndent()
            dockerImage = "node:latest"
        }
        script {
            name = "polymer-cli"
            scriptContent = """
                #!/bin/sh

                set -e -x

                cd examples/polymer-cli
                yarn storybook --smoke-test
            """.trimIndent()
            dockerImage = "node:latest"
        }
        script {
            name = "cra-kitchen-sink"
            scriptContent = """
                #!/bin/sh

                set -e -x

                cd examples/cra-kitchen-sink
                yarn storybook --smoke-test
            """.trimIndent()
            dockerImage = "node:latest"
        }
        script {
            name = "mithril-kitchen-sink"
            scriptContent = """
                #!/bin/sh

                set -e -x

                cd examples/mithril-kitchen-sink
                yarn storybook --smoke-test
            """.trimIndent()
            dockerImage = "node:latest"
        }
        script {
            name = "vue-kitchen-sink"
            scriptContent = """
                #!/bin/sh

                set -e -x

                cd examples/vue-kitchen-sink
                yarn storybook --smoke-test
            """.trimIndent()
            dockerImage = "node:latest"
        }
        script {
            name = "official-storybook"
            scriptContent = """
                #!/bin/sh

                set -e -x

                cd examples/official-storybook
                yarn storybook --smoke-test
            """.trimIndent()
            dockerImage = "node:latest"
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
})
