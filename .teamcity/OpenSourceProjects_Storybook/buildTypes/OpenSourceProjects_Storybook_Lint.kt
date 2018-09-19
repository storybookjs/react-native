package OpenSourceProjects_Storybook.buildTypes

import jetbrains.buildServer.configs.kotlin.v2017_2.*
import jetbrains.buildServer.configs.kotlin.v2017_2.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2017_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2017_2.triggers.vcs
import jetbrains.buildServer.configs.kotlin.v2017_2.failureConditions.BuildFailureOnMetric
import jetbrains.buildServer.configs.kotlin.v2017_2.failureConditions.failOnMetricChange

object OpenSourceProjects_Storybook_Lint : BuildType({
    uuid = "42cfbb9a-f35b-4f96-afae-0b508927a737"
    id = "OpenSourceProjects_Storybook_Lint"
    name = "Lint"

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
            dockerImage = "node:%docker.node.version%"
        }
        script {
            name = "Lint"
            scriptContent = "yarn lint:ci"
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

    failureConditions {
        failOnMetricChange {
            metric = BuildFailureOnMetric.MetricType.INSPECTION_ERROR_COUNT
            threshold = 0
            units = BuildFailureOnMetric.MetricUnit.DEFAULT_UNIT
            comparison = BuildFailureOnMetric.MetricComparison.MORE
            compareTo = value()
            param("anchorBuild", "lastSuccessful")
        }
    }
})
