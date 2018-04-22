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
    description = "https://storybook.js.org/"

    vcsRoot(OpenSourceProjects_Storybook_HttpsGithubComStorybooksStorybookRefsHeadsMaster1)
    vcsRoot(OpenSourceProjects_Storybook_HttpsGithubComStorybooksStorybookRefsHeadsMaster)

    buildType(OpenSourceProjects_Storybook_CliTestLatestCra)
    buildType(OpenSourceProjects_Storybook_Examples)
    buildType(OpenSourceProjects_Storybook_Danger)
    buildType(OpenSourceProjects_Storybook_ReactNative)
    buildType(OpenSourceProjects_Storybook_Docs)
    buildType(OpenSourceProjects_Storybook_Build_2)
    buildType(OpenSourceProjects_Storybook_CliTest)
    buildType(OpenSourceProjects_Storybook_Test)
    buildType(OpenSourceProjects_Storybook_Lint)
    buildType(OpenSourceProjects_Storybook_SmokeTests)
    buildType(OpenSourceProjects_Storybook_Chromatic)

    allApps {
        buildType(config)
    }

    features {
        versionedSettings {
            id = "PROJECT_EXT_258"
            mode = VersionedSettings.Mode.ENABLED
            buildSettingsMode = VersionedSettings.BuildSettingsMode.PREFER_SETTINGS_FROM_VCS
            rootExtId = OpenSourceProjects_Storybook_HttpsGithubComStorybooksStorybookRefsHeadsMaster.id
            showChanges = true
            settingsFormat = VersionedSettings.Format.KOTLIN
            storeSecureParamsOutsideOfVcs = true
        }
        feature {
            type = "buildtype-graphs"
            id = "PROJECT_EXT_132"
            param("series", """
                    [
                      {
                        "type": "valueType",
                        "title": "Build Duration (all stages)",
                        "key": "BuildDuration"
                      }
                    ]
                """.trimIndent())
            param("format", "duration")
            param("hideFilters", "")
            param("title", "Build Duration")
            param("defaultFilters", "")
            param("seriesTitle", "Serie")
        }
        feature {
            id = "PROJECT_EXT_259"
            type = "IssueTracker"
            param("secure:password", "")
            param("name", "storybooks/storybook")
            param("pattern", """#(\d+)""")
            param("authType", "anonymous")
            param("repository", "https://github.com/storybooks/storybook")
            param("type", "GithubIssues")
            param("secure:accessToken", "")
            param("username", "")
        }
        feature {
            id = "PROJECT_EXT_264"
            type = "ReportTab"
            param("startPage", "cra.zip!index.html")
            param("title", "CRA")
            param("type", "BuildReportTab")
        }
        feature {
            id = "PROJECT_EXT_265"
            type = "ReportTab"
            param("startPage", "angular.zip!index.html")
            param("title", "Angular")
            param("type", "BuildReportTab")
        }
        feature {
            id = "PROJECT_EXT_266"
            type = "ReportTab"
            param("startPage", "mithril.zip!index.html")
            param("title", "Mithril")
            param("type", "BuildReportTab")
        }
        feature {
            id = "PROJECT_EXT_267"
            type = "ReportTab"
            param("startPage", "official.zip!index.html")
            param("title", "Official")
            param("type", "BuildReportTab")
        }
        feature {
            id = "PROJECT_EXT_268"
            type = "ReportTab"
            param("startPage", "polymer.zip!index.html")
            param("title", "Polymer")
            param("type", "BuildReportTab")
        }
        feature {
            id = "PROJECT_EXT_269"
            type = "ReportTab"
            param("startPage", "vue.zip!index.html")
            param("title", "Vue")
            param("type", "BuildReportTab")
        }
        feature {
            type = "ReportTab"
            id = "PROJECT_EXT_272"
            param("startPage", "docs.zip!index.html")
            param("title", "Docs")
            param("type", "BuildReportTab")
        }
        feature {
            type = "ReportTab"
            id = "PROJECT_EXT_274"
            param("startPage", "demo.zip!index.html")
            param("title", "Demo")
            param("type", "BuildReportTab")
        }
    }
})
