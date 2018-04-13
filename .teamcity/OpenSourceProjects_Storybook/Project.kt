package OpenSourceProjects_Storybook

import OpenSourceProjects_Storybook.buildTypes.*
import OpenSourceProjects_Storybook.vcsRoots.*
import OpenSourceProjects_Storybook.vcsRoots.OpenSourceProjects_Storybook_HttpsGithubComStorybooksStorybookRefsHeadsMaster
import jetbrains.buildServer.configs.kotlin.v2017_2.*
import jetbrains.buildServer.configs.kotlin.v2017_2.Project
import jetbrains.buildServer.configs.kotlin.v2017_2.projectFeatures.VersionedSettings
import jetbrains.buildServer.configs.kotlin.v2017_2.projectFeatures.versionedSettings

object Project : Project({
    uuid = "69382d9b-7791-418a-9ff6-1c83b86ed6b5"
    id = "OpenSourceProjects_Storybook"
    parentId = "OpenSourceProjects"
    name = "Storybook"

    vcsRoot(OpenSourceProjects_Storybook_HttpsGithubComStorybooksStorybookRefsHeadsMaster)

    buildType(OpenSourceProjects_Storybook_Build)

    features {
        feature {
            id = "PROJECT_EXT_252"
            type = "ReportTab"
            param("startPage", "cra/index.html")
            param("title", "CRA")
            param("type", "BuildReportTab")
        }
        feature {
            id = "PROJECT_EXT_253"
            type = "ReportTab"
            param("startPage", "vue/index.html")
            param("title", "Vue")
            param("type", "BuildReportTab")
        }
        feature {
            id = "PROJECT_EXT_254"
            type = "ReportTab"
            param("startPage", "angular/index.html")
            param("title", "Angular")
            param("type", "BuildReportTab")
        }
        feature {
            id = "PROJECT_EXT_255"
            type = "ReportTab"
            param("startPage", "polymer/index.html")
            param("title", "Polymer")
            param("type", "BuildReportTab")
        }
        feature {
            id = "PROJECT_EXT_256"
            type = "ReportTab"
            param("startPage", "mithril/index.html")
            param("title", "Mithril")
            param("type", "BuildReportTab")
        }
        feature {
            id = "PROJECT_EXT_257"
            type = "ReportTab"
            param("startPage", "storybook/index.html")
            param("title", "Official")
            param("type", "BuildReportTab")
        }
        versionedSettings {
            id = "PROJECT_EXT_258"
            mode = VersionedSettings.Mode.ENABLED
            buildSettingsMode = VersionedSettings.BuildSettingsMode.PREFER_CURRENT_SETTINGS
            rootExtId = OpenSourceProjects_Storybook_HttpsGithubComStorybooksStorybookRefsHeadsMaster.id
            showChanges = true
            settingsFormat = VersionedSettings.Format.KOTLIN
            storeSecureParamsOutsideOfVcs = true
        }
    }
})
