# Ahmet mobile app

Ahmet mobile app is a mobile front-end that exposes the functionalities of the 
back-end API. For the time being, only android OS is fully supported while IOS 
has not been tested yet.


## Table of contents

1. [Project structure](#project-structure)
2. [Installation and startup](#installation-and-startup)
3. [General description](#general-description)
4. [Main features](#main-features)


## Project structure

    /Mobileapp: folder containing the mobile application
    |
    |--> /Components: folder containing components shared within the App.
    |       |--> /Cards: folker keeping the files used for rendering customized
    |       |           cards.
    |       |--> /Charts: 
    |       |--> /Fetcher:
    |       |--> /SideMenu:     
    |
    |--> /Views: folder containing all the files for rendering app's screens.
    |       |--> Screen1: homepage.
    |       |--> Screen2: tabular studies.
    |       |--> Screen3: studies statistics.
    |       |--> Screen4: login.
    |       |--> Screen5: logout.
    |
    |--> /android: floder containing the settings for building the mobile app.
    |--> index.js:
    |--> App.js:


## Installation and startup

Refer to the outer API README for complete installation of the Mobile app and
API.


## General description

The mobile app communicates with the backend API for expressing the Ahmet's
functionalities in a more lean manner. All functionalities are intact, except
for the creation of a new study that is left to the Webapp (accessible from a
web browser).


## Main features

TODO
