<h1 align="left"> Ekkremis </h1> <br>
<p align="left">
  <a href="https://gitpoint.co/"> 
    <img alt="Ekkremis Banner" title="Ekkremis Banner" src="./src/img/Ekkremis_Banner.jpg" width="450">
  </a>
</p>

<p align="left">
  Optomize your Kubernetes pod lifecycle. Built with React Typescript with Electron/Node.js runtime.
</p>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Feedback](#feedback)
- [Contributors](#contributors)
- [Dashboard Build Process](#dashboard-build-process)
- [Acknowledgments](#acknowledgments)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
## Introduction

[![Build Status](https://img.shields.io/travis/gitpoint/git-point.svg?style=flat-square)](https://travis-ci.org/gitpoint/git-point)
[![Coveralls](https://img.shields.io/coveralls/github/gitpoint/git-point.svg?style=flat-square)](https://coveralls.io/github/gitpoint/git-point)
[![All Contributors](https://img.shields.io/badge/all_contributors-73-orange.svg?style=flat-square)](./CONTRIBUTORS.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)
[![Gitter chat](https://img.shields.io/badge/chat-on_gitter-008080.svg?style=flat-square)](https://gitter.im/git-point)

This repository contains the code for Ekkremis: a prometheus-based alertmanager to resolve kubernetes pods stuck in pending phase complete with optional lifecycle dashboard and alerts. 
## Requirements
- Prometheus
- npm
- yarn
## Features

A few of the things you can do with Ekkremis:

* Reduce manual queries to find unhealthy or pending pods 
* Receive alerts by email or slack when your pods are stuck in pending
* Implement tailored solutions suggested by Ekkremis to get your pods up and running

<p align="left">
  <img src = "./src/img/Ekkremis-logo-dark.png" width=700>
</p>

**Optional Ekkremis Lifecycle Dashboard.**

<p align="left">
  <img src = "./src/img/charts.png" width=350>
</p>

<p align="left">
  <img src = "./src/img/charts.png" width=700>
</p>


## Alert Manager Installation Steps

1. `npm install` will download dependencies..
2. `pendingPods-PrometheusRulesFile.yml` contains ....

## Dashboard Build Process

- Follow the [React Native Guide](https://facebook.github.io/react-native/docs/getting-started.html) for getting started building a project with native code. **A Mac is required if you wish to develop for iOS.**
- Clone or download the repo
- `yarn` to install dependencies
- `yarn run link` to link react-native dependencies
- `yarn start:ios` to start the packager and run the app in the iOS simulator (`yarn start:ios:logger` will boot the application with [redux-logger](<https://github.com/evgenyrodionov/redux-logger>))
- `yarn start:android` to start the packager and run the app in the the Android device/emulator (`yarn start:android:logger` will boot the application with [redux-logger](https://github.com/evgenyrodionov/redux-logger))
## Running the DEMO with Mock Data

1. 
## Feedback

If something is not behaving intuitively, it is a bug and should be reported.
Report it here by creating an issue: https://github.com/oslabs-beta/ekkremis/issues

Help us fix the problem as quickly as possible by following [Mozilla's guidelines for reporting bugs.](https://developer.mozilla.org/en-US/docs/Mozilla/QA/Bug_writing_guidelines#General_Outline_of_a_Bug_Report)

Feel free to send us feedback on [Twitter](https://twitter.com/gitpointapp) or [file an issue](https://github.com/gitpoint/git-point/issues/new). Feature requests are always welcome. If you wish to contribute, please take a quick look at the [guidelines](./CONTRIBUTING.md)!

If there's anything you'd like to chat about, please feel free to join our [Gitter chat](https://gitter.im/git-point)!

## Contributors

This project is brought to you by these [awesome contributors](./CONTRIBUTORS.md).

Please take a look at the [contributing guidelines](./CONTRIBUTING.md) for a detailed process on how to build your application as well as troubleshooting information.

## Acknowledgments

Thanks to tech accelerator [OSLabs-Beta](https://github.com/oslabs-beta) for supporting this project.

