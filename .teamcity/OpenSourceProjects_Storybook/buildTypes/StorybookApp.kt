package OpenSourceProjects_Storybook.buildTypes

import jetbrains.buildServer.configs.kotlin.v2017_2.*
import jetbrains.buildServer.configs.kotlin.v2017_2.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2017_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2017_2.failureConditions.BuildFailureOnMetric
import jetbrains.buildServer.configs.kotlin.v2017_2.failureConditions.failOnMetricChange

enum class StorybookApp(val appName: String, val exampleDir: String, val merged: Boolean = true) {
    CRA("CRA", "cra-kitchen-sink"),
    VUE("Vue", "vue-kitchen-sink"),
    ANGULAR("Angular", "angular-cli"),
    POLYMER("Polymer", "polymer-cli"),
    MITHRIL("Mithril", "mithril-kitchen-sink"),
    HTML("HTML", "html-kitchen-sink"),
    MARKO("Marko", "marko-cli"),
    SVELTE("Svelte", "svelte-kitchen-sink"),
    RIOT("Riot", "riot-kitchen-sink"),
    EMBER("Ember", "ember-cli");

    val lowerName = appName.toLowerCase()

    val artifactPath = "examples/$exampleDir/storybook-static => $lowerName.zip"

    val config = object : BuildType(init@{
        uuid = "8cc5f747-4ca7-4f0d-940d-b0c422f501a6-$lowerName"
        id = "OpenSourceProjects_Storybook_$appName"
        name = appName

        vcs {
            root(OpenSourceProjects_Storybook.vcsRoots.OpenSourceProjects_Storybook_HttpsGithubComStorybooksStorybookRefsHeadsMaster)
        }

        if (!merged) return@init

        artifactRules = artifactPath

        steps {
            script {
                name = "build"
                scriptContent = """
                    #!/bin/sh

                    set -e -x

                    yarn
                    cd examples/$exampleDir
                    yarn build-storybook
                """.trimIndent()
                dockerImage = "node:%docker.node.version%"
            }
        }

        failureConditions {
            failOnMetricChange {
                metric = BuildFailureOnMetric.MetricType.ARTIFACT_SIZE
                threshold = 50
                units = BuildFailureOnMetric.MetricUnit.PERCENTS
                comparison = BuildFailureOnMetric.MetricComparison.LESS
                compareTo = build {
                    buildRule = lastSuccessful()
                }
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
                    artifactRules = """
                        dist.zip!**
                    """.trimIndent()
                }
            }
        }

        requirements {
            doesNotContain("env.OS", "Windows")
        }
    }) {}
}

fun allApps(handler: StorybookApp.() -> Unit) =
    StorybookApp.values().forEach { it.handler() }
