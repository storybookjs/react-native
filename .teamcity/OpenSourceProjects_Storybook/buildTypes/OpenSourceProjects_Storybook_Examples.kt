package OpenSourceProjects_Storybook.buildTypes

import jetbrains.buildServer.configs.kotlin.v2017_2.*
import jetbrains.buildServer.configs.kotlin.v2017_2.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2017_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2017_2.failureConditions.BuildFailureOnMetric
import jetbrains.buildServer.configs.kotlin.v2017_2.failureConditions.failOnMetricChange

object OpenSourceProjects_Storybook_Examples : BuildType({
    uuid = "8cc5f747-4ca7-4f0d-940d-b0c422f501a6"
    id = "OpenSourceProjects_Storybook_Examples"
    name = "Examples"

    artifactRules = """
        ${StorybookApp.values().map { it.artifactPath }.joinToString("\n")}
        examples/official-storybook/storybook-static => official.zip
        examples/official-storybook/image-snapshots/__image_snapshots__ => image-snapshots
    """.trimIndent()

    vcs {
        root(OpenSourceProjects_Storybook.vcsRoots.OpenSourceProjects_Storybook_HttpsGithubComStorybooksStorybookRefsHeadsMaster)

    }

    steps {
        script {
            name = "official-storybook"
            scriptContent = """
                #!/bin/sh
                
                set -e -x

                yarn
                cd examples/official-storybook
                rm -rf storybook-static
                yarn build-storybook
            """.trimIndent()
            dockerImage = "node:%docker.node.version%"
        }
        script {
            name = "Image storyshots"
            scriptContent = """
                #!/bin/sh
                
                set -e -x
                
                # Workaround for https://github.com/GoogleChrome/puppeteer/issues/290
                
                apt-get update
                apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
                  libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
                  libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
                  libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
                  ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
                yarn test --image --teamcity
            """.trimIndent()
            dockerImage = "node:%docker.node.version%"
        }
    }

    failureConditions {
        failOnMetricChange {
            metric = BuildFailureOnMetric.MetricType.ARTIFACT_SIZE
            threshold = 60
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
