#!/usr/bin/env node
const notifier = require("./lib/notifier");
const { consoleLogin } = require("./lib/console-login");
const { pollFavoriteBusinesses$ } = require("./lib/poller");
const { editConfig, resetConfig, configPath, config } = require("./lib/config");

const argv = require("yargs")
  .usage("Usage: toogoodtogo-watcher <command>")
  .env("TOOGOODTOGO")
  .command("config", "Edit the config file.")
  .command("config-reset", "Reset the config to the default values.")
  .command("config-path", "Show the path of the config file.")
  .command("login", "Interactively login via a login email.", {
    email: {
      type: "string",
      describe:
        "The email address to login with. If not specified the configured email address will be used.",
    },
  })
  .command("watch", "Watch your favourite businesses for changes.", {
    config: {
      type: "string",
      describe:
        "Custom config. Note: the config will be overwrite the current config file.",
    },
  })
  .demandCommand().argv;

switch (argv._[0]) {
  case "config":
    editConfig();
    break;

  case "config-reset":
    resetConfig();
    break;

  case "config-path":
    configPath();
    break;

  case "login":
    if (argv.email) {
      config.set("api.credentials.email", argv.email);
    }
    consoleLogin();
    break;

  case "watch":
    if (argv.config) {
      const customConfig = JSON.parse(argv.config);
      config.set(customConfig);
    }

    if(process.env.TGTG_CONFIG){
      const customConfig = JSON.parse(process.env.TGTG_CONFIG);

      console.log('init with custom config from environment');

      console.log(JSON.stringify(customConfig, undefined,2))
      config.set(customConfig);
    }

    pollFavoriteBusinesses$(notifier.hasListeners$()).subscribe(
      (businesses) => notifier.notifyIfChanged(businesses),
      console.error
    );
    break;
}
