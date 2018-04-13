package OpenSourceProjects_Storybook.buildTypes

import jetbrains.buildServer.configs.kotlin.v2017_2.*
import jetbrains.buildServer.configs.kotlin.v2017_2.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2017_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2017_2.triggers.vcs

object OpenSourceProjects_Storybook_Build : BuildType({
    uuid = "8cc5f747-4ca7-4f0d-940d-b0c422f501a6"
    id = "OpenSourceProjects_Storybook_Build"
    name = "Build"

    artifactRules = """
        examples/official-storybook/storybook-static => official
        examples/angular-cli/storybook-static => angular
        examples/polymer-cli/storybook-static => polymer
        examples/cra-kitchen-sink/storybook-static => cra
        examples/mithril-kitchen-sink/storybook-static => mithril
        examples/vue-kitchen-sink/storybook-static => vue
        coverage/lcov-report => coverage.zip
    """.trimIndent()

    vcs {
        root(OpenSourceProjects_Storybook.vcsRoots.OpenSourceProjects_Storybook_HttpsGithubComStorybooksStorybookRefsHeadsMaster)

    }

    steps {
        script {
            name = "Bootstrap"
            scriptContent = """
                yarn
                yarn bootstrap --core --docs
            """.trimIndent()
            dockerImage = "node:latest"
        }
        script {
            name = "Lint"
            scriptContent = "yarn lint"
            dockerImage = "node:latest"
        }
        script {
            name = "Test"
            scriptContent = "yarn test --core --coverage --runInBand"
            dockerImage = "node:latest"
        }
        script {
            name = "Build angular-cli"
            scriptContent = """
                cd examples/angular-cli
                yarn build-storybook
            """.trimIndent()
            dockerImage = "node:latest"
        }
        script {
            name = "Build polymer-cli"
            scriptContent = """
                cd examples/polymer-cli
                yarn build-storybook
            """.trimIndent()
            dockerImage = "node:latest"
        }
        script {
            name = "Build cra-kitchen-sink"
            scriptContent = """
                cd examples/cra-kitchen-sink
                yarn build-storybook
            """.trimIndent()
            dockerImage = "node:latest"
        }
        script {
            name = "Build mithril-kitchen-sink"
            scriptContent = """
                cd examples/mithril-kitchen-sink
                yarn build-storybook
            """.trimIndent()
            dockerImage = "node:latest"
        }
        script {
            name = "Build vue-kitchen-sink"
            scriptContent = """
                cd examples/vue-kitchen-sink
                yarn build-storybook
            """.trimIndent()
            dockerImage = "node:latest"
        }
        script {
            name = "Build official-storybook"
            scriptContent = """
                cd examples/official-storybook
                yarn build-storybook
            """.trimIndent()
            dockerImage = "node:latest"
        }
    }

    triggers {
        vcs {
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
