package OpenSourceProjects_Storybook.buildTypes

import jetbrains.buildServer.configs.kotlin.v2017_2.*
import jetbrains.buildServer.configs.kotlin.v2017_2.buildFeatures.commitStatusPublisher
import jetbrains.buildServer.configs.kotlin.v2017_2.failureConditions.BuildFailureOnMetric
import jetbrains.buildServer.configs.kotlin.v2017_2.failureConditions.failOnMetricChange
import jetbrains.buildServer.configs.kotlin.v2017_2.triggers.VcsTrigger
import jetbrains.buildServer.configs.kotlin.v2017_2.triggers.vcs

object OpenSourceProjects_Storybook_SBNext : BuildType({
    uuid = "dc66f07a-281f-4434-97ca-f1480b7cfc51"
    id = "OpenSourceProjects_Storybook_SBNext"
    name = "SBNext"

    artifactRules = "ui/out => demo.zip"

    vcs {
        root("OpenSourceProjects_Storybook_SBNext")

    }

    steps {
        script {
            name = "Install"
            scriptContent = "yarn"
            dockerImage = "node:latest"
        }
        script {
            name = "Lint"
            scriptContent = "yarn lint"
            dockerImage = "node:latest"
        }
        script {
            name = "Test"
            enabled = false
            scriptContent = "yarn test"
            dockerImage = "node:latest"
        }
        script {
            name = "Build"
            workingDir = "server"
            scriptContent = "yarn build"
            dockerImage = "node:latest"
        }
        script {
            name = "Export"
            workingDir = "demo"
            scriptContent = "yarn export"
            dockerImage = "node:latest"
        }
    }

    triggers {
        vcs {
        }
    }

    requirements {
        doesNotContain("env.OS", "Windows")
    }
})
