package OpenSourceProjects_Storybook.buildTypes

import jetbrains.buildServer.configs.kotlin.v2017_2.*
import jetbrains.buildServer.configs.kotlin.v2017_2.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2017_2.buildSteps.script

object OpenSourceProjects_Storybook_ReactNative : BuildType({
    uuid = "ac276912-df1a-44f1-8de2-056276193ce8"
    id = "OpenSourceProjects_Storybook_ReactNative"
    name = "React Native"

    artifactRules = "examples/react-native-vanilla/coverage/lcov-report => coverage.zip"

    params {
        param("env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD", "true")
    }

    vcs {
        root(OpenSourceProjects_Storybook.vcsRoots.OpenSourceProjects_Storybook_HttpsGithubComStorybooksStorybookRefsHeadsMaster)

        cleanCheckout = true
    }

    steps {
        script {
            name = "Bootstrap"
            scriptContent = """
                yarn
                yarn bootstrap --core --reactnative --reactnativeapp
            """.trimIndent()
            dockerImage = "node:9"
        }
        script {
            name = "react-native-vanilla"
            scriptContent = """
                cd examples/react-native-vanilla
                yarn storybook --smoke-test
            """.trimIndent()
            dockerImage = "node:9"
        }
        script {
            name = "crna-kitchen-sink"
            scriptContent = """
                cd examples/crna-kitchen-sink
                yarn storybook --smoke-test
            """.trimIndent()
            dockerImage = "node:9"
        }
        script {
            name = "Test"
            scriptContent = """
                yarn test --reactnative --coverage --runInBand --teamcity
                yarn coverage
            """.trimIndent()
            dockerImage = "node:9"
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
