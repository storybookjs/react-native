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

    params {
        param("env.CI_BRANCH", "%teamcity.build.branch%")
    }

    vcs {
        root(OpenSourceProjects_Storybook.vcsRoots.OpenSourceProjects_Storybook_HttpsGithubComStorybooksStorybookRefsHeadsMaster)

    }

    steps {
        script {
            name = "Chromatic"
            scriptContent = """
                #!/bin/sh

                # set -e -x
                # yarn
                # yarn chromatic
                echo "chromatic moved to cirlce CI"
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
        allApps {
            dependency(config) {
                snapshot {}

                if (merged) {
                    artifacts {
                        cleanDestination = true
                        artifactRules = "$lowerName.zip!** => examples/$exampleDir/storybook-static"
                    }
                }
            }
        }
    }

    requirements {
        doesNotContain("env.OS", "Windows")
    }
})
