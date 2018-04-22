package OpenSourceProjects_Storybook.buildTypes

import jetbrains.buildServer.configs.kotlin.v2017_2.*
import jetbrains.buildServer.configs.kotlin.v2017_2.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2017_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2017_2.failureConditions.BuildFailureOnMetric
import jetbrains.buildServer.configs.kotlin.v2017_2.failureConditions.failOnMetricChange

object OpenSourceProjects_Storybook_Chromatic : BuildType({
    uuid = "8cc5f747-4ca7-4f0d-940d-b0c422f501a6-chromatic"
    id = "OpenSourceProjects_Storybook_Chromatic"
    name = "Chromatic"

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
            name = "Chromatic"
            scriptContent = "yarn chromatic"
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

    dependencies {
        dependency(OpenSourceProjects_Storybook.buildTypes.OpenSourceProjects_Storybook_CRA) {
            snapshot {
                onDependencyCancel = FailureAction.CANCEL
            }

            artifacts {
                artifactRules = "cra.zip!** => examples/cra-kitchen-sink/storybook-static"
            }
        }
        dependency(OpenSourceProjects_Storybook.buildTypes.OpenSourceProjects_Storybook_Vue) {
            snapshot {
                onDependencyCancel = FailureAction.CANCEL
            }

            artifacts {
                artifactRules = "vue.zip!** => examples/vue-kitchen-sink/storybook-static"
            }
        }
        dependency(OpenSourceProjects_Storybook.buildTypes.OpenSourceProjects_Storybook_Angular) {
            snapshot {
                onDependencyCancel = FailureAction.CANCEL
            }

            artifacts {
                artifactRules = "angular.zip!** => examples/angular-cli/storybook-static"
            }
        }
        dependency(OpenSourceProjects_Storybook.buildTypes.OpenSourceProjects_Storybook_Polymer) {
            snapshot {
                onDependencyCancel = FailureAction.CANCEL
            }

            artifacts {
                artifactRules = "polymer.zip!** => examples/polymer-cli/storybook-static"
            }
        }
        dependency(OpenSourceProjects_Storybook.buildTypes.OpenSourceProjects_Storybook_Mithril) {
            snapshot {
                onDependencyCancel = FailureAction.CANCEL
            }

            artifacts {
                artifactRules = "mithril.zip!** => examples/mithril-kitchen-sink/storybook-static"
            }
        }
    }

    requirements {
        doesNotContain("env.OS", "Windows")
    }
})
