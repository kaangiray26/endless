<div align="center">
    <a href="https://github.com/kaangiray26/endless">
        <img src="https://raw.githubusercontent.com/kaangiray26/endless/main/src/public/favicon.png" alt="Endless Logo" width="80" height="80">
    </a>
    <h1 align="center">Endless</h1>
    <p align="center">
        Unifying the social media experience
        <br />
        <div align="center">
            <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/kaangiray26/endless?style=flat-square">
            <img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/m/kaangiray26/endless?style=flat-square">
            <img alt="GitHub issues" src="https://img.shields.io/github/issues/kaangiray26/endless?style=flat-square">
            <img alt="License" src="https://img.shields.io/github/license/kaangiray26/endless.svg?style=flat-square">
            <img alt="Website" src="https://img.shields.io/website?down_color=red&down_message=offline&style=flat-square&up_color=success&up_message=online&url=https%3A%2F%2Fhome.buzl.uk">
        </div>
        <a href="https://github.com/kaangiray26/endless/issues">Report Bug</a>
        ·
        <a href="https://github.com/kaangiray26/endless/issues">Request Feature</a>
    </p>
</div>

## What is Endless?
Endless is a social media curator that allows you to view all of your favorite websites in one place with a unified card-based interface. It allows for users to upvote, save and comment on posts from websites even if the website doesn't support it.

## Screenshots
<div align="center">
    <img src="images/screenshot_1.png" width=160>
    <img src="images/screenshot_2.png" width=160>
    <img src="images/screenshot_3.png" width=160>
    <img src="images/screenshot_4.png" width=160>
    <img src="images/screenshot_5.png" width=160>
</div>

## Installation
Download the APK from [GitHub Releases](https://github.com/kaangiray26/endless/releases) and install it.

## Features
* No account needed
* Save posts
* Upvote posts
* Comment on posts
* Remove upvotes and comments if needed
* Fuzzy search on post titles on feed

## Supported Websites
- [x] Wikipedia
- [x] Hacker News
- [x] GamingOnLinux
- [x] Cumhuriyet
- [x] Darknet Diaries
- [x] Slashdot
- [x] Quanta Magazine
- [x] Reddit
- [ ] Ars Technica
- [ ] The Onion

## Starting the server
You can use the [docker-compose.yml](server/docker-compose.yml) file to start the server.

## How to contribute?
You can contribute to Endless by adding support for new websites or by improving the existing codebase. If you want to add support for a new website, take a look at the existing extractors. Usually, each website has its own extractor with two methods inside the [extractors](https://github.com/kaangiray26/endless/tree/main/extractors) directory. If you want to improve the existing codebase, you can do so by creating a pull request.

## Extractors
Take a look at the [extractor list](list.json) below to see which websites are supported at the moment.

Prebuilt versions of the extractors are also located in the [min](https://github.com/kaangiray26/endless/tree/main/min) directory.
* For example: [Hacker News](min/hacker-news.min.js)

## Wiki
> Coming soon
