package OpenSourceProjects_Storybook.buildTypes

import jetbrains.buildServer.configs.kotlin.v2017_2.*
import jetbrains.buildServer.configs.kotlin.v2017_2.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2017_2.failureConditions.BuildFailureOnMetric
import jetbrains.buildServer.configs.kotlin.v2017_2.failureConditions.failOnMetricChange
import jetbrains.buildServer.configs.kotlin.v2017_2.triggers.vcs
import jetbrains.buildServer.configs.kotlin.v2017_2.triggers.VcsTrigger
import jetbrains.buildServer.configs.kotlin.v2017_2.triggers.finishBuildTrigger
import jetbrains.buildServer.configs.kotlin.v2017_2.triggers.retryBuild
import jetbrains.buildServer.configs.kotlin.v2017_2.buildFeatures.merge
import jetbrains.buildServer.configs.kotlin.v2017_2.ui.*

object OpenSourceProjects_Storybook_Build_2 : BuildType({
    uuid = "2b9c73e2-0a6e-47ca-95ae-729cac42be2b"
    id = "OpenSourceProjects_Storybook_Build_2"
    name = "Build"

    allowExternalStatus = true
    type = BuildTypeSettings.Type.COMPOSITE

    vcs {
        root(OpenSourceProjects_Storybook.vcsRoots.OpenSourceProjects_Storybook_HttpsGithubComStorybooksStorybookRefsHeadsMaster)

        showDependenciesChanges = true
    }

    triggers {
        vcs {
            quietPeriodMode = VcsTrigger.QuietPeriodMode.USE_DEFAULT
            triggerRules = "-:comment=^TeamCity change:**"
            branchFilter = """
                +:pull/*
                +:release/*
                +:master
                +:next
                +:snyk-fix-*
            """.trimIndent()
        }
        retryBuild {
            delaySeconds = 60
            enabled = false
        }
        finishBuildTrigger {
            enabled = false
            buildTypeExtId = "OpenSourceProjects_Storybook_Bootstrap"
            successfulOnly = true
            branchFilter = ""
        }
    }

    failureConditions {
        failOnMetricChange {
            metric = BuildFailureOnMetric.MetricType.TEST_COUNT
            threshold = 20
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
        merge {
            branchFilter = """
                +:snyk-fix-*
            """.trimIndent()
            destinationBranch = "<default>"
            commitMessage = "Merge branch '%teamcity.build.branch%'"
        }
    }

    dependencies {
        dependency(OpenSourceProjects_Storybook.buildTypes.OpenSourceProjects_Storybook_Docs) {
            snapshot {
                onDependencyCancel = FailureAction.ADD_PROBLEM
            }
        }
        dependency(OpenSourceProjects_Storybook.buildTypes.OpenSourceProjects_Storybook_Examples) {
            snapshot {
                onDependencyCancel = FailureAction.ADD_PROBLEM
            }
        }
        dependency(OpenSourceProjects_Storybook.buildTypes.OpenSourceProjects_Storybook_Lint) {
            snapshot {
                onDependencyCancel = FailureAction.ADD_PROBLEM
            }
        }
        dependency(OpenSourceProjects_Storybook.buildTypes.OpenSourceProjects_Storybook_NativeSmokeTests) {
            snapshot {
                onDependencyCancel = FailureAction.ADD_PROBLEM
            }
        }
        dependency(OpenSourceProjects_Storybook.buildTypes.OpenSourceProjects_Storybook_SmokeTests) {
            snapshot {
                onDependencyCancel = FailureAction.ADD_PROBLEM
            }
        }
        dependency(OpenSourceProjects_Storybook.buildTypes.OpenSourceProjects_Storybook_Test) {
            snapshot {
                onDependencyCancel = FailureAction.ADD_PROBLEM
            }
        }
        dependency(OpenSourceProjects_Storybook.buildTypes.OpenSourceProjects_Storybook_Chromatic) {
            snapshot {
                onDependencyCancel = FailureAction.ADD_PROBLEM
            }
        }
        dependency(OpenSourceProjects_Storybook.buildTypes.OpenSourceProjects_Storybook_CliTest) {
            snapshot {
                onDependencyCancel = FailureAction.ADD_PROBLEM
            }
        }
    }
})
