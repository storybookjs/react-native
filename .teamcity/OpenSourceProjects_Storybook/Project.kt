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

    buildType(OpenSourceProjects_Storybook_Bootstrap)
    buildType(OpenSourceProjects_Storybook_CliTestLatestCra)
    buildType(OpenSourceProjects_Storybook_Examples)
    buildType(OpenSourceProjects_Storybook_Docs)
    buildType(OpenSourceProjects_Storybook_Build_2)
    buildType(OpenSourceProjects_Storybook_Test)
    buildType(OpenSourceProjects_Storybook_Lint)
    buildType(OpenSourceProjects_Storybook_Lint_Warnings)
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
        allApps {
            feature {
                id = "PROJECT_EXT_264_$lowerName"
                type = "ReportTab"
                param("startPage", "$lowerName.zip!index.html")
                param("title", appName)
                param("type", "BuildReportTab")
            }
        }
        feature {
            id = "PROJECT_EXT_267"
            type = "ReportTab"
            param("startPage", "official.zip!index.html")
            param("title", "Official")
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
        feature {
            type = "project-graphs"
            id = "PROJECT_EXT_306"
            param("series", """
                [
                  {
                    "type": "valueType",
                    "title": "Build Duration (all stages)",
                    "sourceBuildTypeId": "OpenSourceProjects_Storybook_Build_2",
                    "key": "BuildDuration"
                  }
                ]
            """.trimIndent())
            param("format", "duration")
            param("seriesTitle", "Serie")
            param("hideFilters", "")
            param("title", "Build Duration (all stages)")
            param("defaultFilters", "")
        }
        feature {
            type = "project-graphs"
            id = "PROJECT_EXT_307"
            param("series", """
                [
                  {
                    "type": "valueType",
                    "title": "Covered Percentage of JS Lines",
                    "sourceBuildTypeId": "OpenSourceProjects_Storybook_Test",
                    "key": "Covered Percentage of JS Lines"
                  }
                ]
            """.trimIndent())
            param("format", "percent")
            param("hideFilters", "")
            param("title", "Covered Percentage of JS Lines")
            param("defaultFilters", "")
            param("seriesTitle", "Serie")
        }
        feature {
            type = "project-graphs"
            id = "PROJECT_EXT_308"
            param("series", """
                [
                  {
                    "type": "valueType",
                    "title": "Total Number of JS Statements",
                    "sourceBuildTypeId": "OpenSourceProjects_Storybook_Test",
                    "key": "Total Number of JS Statements"
                  }
                ]
            """.trimIndent())
            param("format", "integer")
            param("seriesTitle", "Serie")
            param("hideFilters", "")
            param("title", "Total Number of JS Statements")
            param("defaultFilters", "")
        }
        feature {
            type = "project-graphs"
            id = "PROJECT_EXT_117"
            param("series", """
                    [
                      {
                        "type": "valueType",
                        "title": "Total Artifacts Size",
                        "sourceBuildTypeId": "OpenSourceProjects_Storybook_CliTestLatestCra",
                        "key": "ArtifactsSize"
                      }
                    ]
                """.trimIndent())
            param("format", "text")
            param("title", "Total Artifacts Size")
            param("seriesTitle", "Serie")
        }
        feature {
            type = "Invitation"
            id = "PROJECT_EXT_209"
            param("createdByUserId", "1702")
            param("invitationType", "joinProjectInvitation")
            param("secure:token", "credentialsJSON:07400f1b-a51d-46ae-b056-2e24a653f4d1")
            param("name", "Join Storybook project")
            param("welcomeText", "Filipp Riabchun invites you to join the Storybook project")
            param("disabled", "false")
            param("groupKey", "STORYBOOK_DEVELO")
            param("multi", "true")
        }
    }

    params {
        param("docker.node.version", "dubnium")
    }
})
