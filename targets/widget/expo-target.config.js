/** @type {import('@bacons/apple-targets').Config} */
module.exports = {
  type: "widget",
  name: "OdakWidget",
  bundleIdentifier: ".widget",
  deploymentTarget: "17.0",
  entitlements: {
    "com.apple.security.application-groups": ["group.com.omc345.odak"],
  },
  frameworks: ["SwiftUI", "WidgetKit"],
};
