package OpenSourceProjects_Storybook.buildTypes

import jetbrains.buildServer.configs.kotlin.v2017_2.*
import jetbrains.buildServer.configs.kotlin.v2017_2.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2017_2.failureConditions.BuildFailureOnMetric
import jetbrains.buildServer.configs.kotlin.v2017_2.failureConditions.failOnMetricChange
import jetbrains.buildServer.configs.kotlin.v2017_2.triggers.VcsTrigger
import jetbrains.buildServer.configs.kotlin.v2017_2.triggers.vcs

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
            branchFilter = "+:dependencies.io-*"
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
        dependency(OpenSourceProjects_Storybook.buildTypes.OpenSourceProjects_Storybook_ReactNative) {
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
    }
})
