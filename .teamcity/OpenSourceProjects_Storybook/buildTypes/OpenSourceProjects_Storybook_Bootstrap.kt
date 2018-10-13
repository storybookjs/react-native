package OpenSourceProjects_Storybook.buildTypes

import jetbrains.buildServer.configs.kotlin.v2017_2.*
import jetbrains.buildServer.configs.kotlin.v2017_2.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2017_2.buildSteps.script
import jetbrains.buildServer.configs.kotlin.v2017_2.triggers.vcs

object OpenSourceProjects_Storybook_Bootstrap : BuildType({
    uuid = "9f9177e7-9ec9-4e2e-aabb-d304fd667712"
    id = "OpenSourceProjects_Storybook_Bootstrap"
    name = "Bootstrap"

    artifactRules = """
        node_modules/** => dependencies/node_modules
        addons/*/node_modules/** => dependencies/addons
        addons/storyshots/*/node_modules/** => dependencies/addons/storyshots
        app/*/node_modules/** => dependencies/app
        examples/*/node_modules/** => dependencies/examples
        lib/*/node_modules/** => dependencies/lib
        addons/*/dist/** => dist/addons
        addons/storyshots/*/dist/** => dist/addons/storyshots
        app/*/dist/** => dist/app
        lib/*/dist/** => dist/lib
    """.trimIndent()

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
})
