import { defineConfig } from "cypress"
import * as cypressCodeCoverage from "@cypress/code-coverage/task"

export default defineConfig({
  video: false,
  screenshotOnRunFailure: false,
  e2e: {
    baseUrl: "http://localhost:5173",
    setupNodeEvents(on, config) {
      cypressCodeCoverage.default(on, config)

      return config
    },
  },
  env: {
    codeCoverage: {
      url: "http://localhost:4000/__coverage__",
    },
  },
})
