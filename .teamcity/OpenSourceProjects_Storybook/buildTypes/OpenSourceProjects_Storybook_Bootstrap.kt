package OpenSourceProjects_Storybook.buildTypes

import jetbrains.buildServer.configs.kotlin.v2017_2.*
import jetbrains.buildServer.configs.kotlin.v2017_2.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2017_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2017_2.triggers.vcs
import jetbrains.buildServer.configs.kotlin.v2017_2.triggers.retryBuild
import jetbrains.buildServer.configs.kotlin.v2017_2.triggers.VcsTrigger

object OpenSourceProjects_Storybook_Bootstrap : BuildType({
    uuid = "9f9177e7-9ec9-4e2e-aabb-d304fd667712"
    id = "OpenSourceProjects_Storybook_Bootstrap"
    name = "Bootstrap"

    artifactRules = """
        addons/*/dist/** => dist.zip/addons
        addons/storyshots/*/dist/** => dist.zip/addons/storyshots
        app/*/dist/** => dist.zip/app
        lib/*/dist/** => dist.zip/lib
        lib/core/dll/** => dist.zip/lib/core/dll
    """.trimIndent()

    vcs {
        root(OpenSourceProjects_Storybook.vcsRoots.OpenSourceProjects_Storybook_HttpsGithubComStorybooksStorybookRefsHeadsMaster)
    }

    steps {
        script {
            name = "Bootstrap"
            scriptContent = """
                #!/bin/sh

                set -e -x

                yarn
                yarn bootstrap --core
            """.trimIndent()
            dockerImage = "node:%docker.node.version%"
        }
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
            enabled = false
        }
        retryBuild {
            delaySeconds = 60
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
})
