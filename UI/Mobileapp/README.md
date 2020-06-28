# Ahmet mobile app


## Table of contents

1. [Project structure](#project-structure)
2. [Installation and startup](#installation-and-startup)
3. [General description](#general-description)


## Project structure

    /
    |--> UI
    |     |
    |     |--> Mobileapp: folder containing the mobile application
    |          |
    |          |-->Components: containing components shared for the App
    |              |
    |              |--> Cards: js file using for render a custom Card
    |              |--> Charts: js file using for render Graphs
    |              |--> Fetcher: container for API method
    |              |--> SideMenu: js file using for render a side menu
    |          |
    |          |--> Views: folder containing all js file for render app's screens      


## Installation and startup

The Mobile app is created by React Native project without 
Expo Cli, but only using a React Native Cli, so
before start make sure you have the enviroment set up in the
section React Native Cli Quickstart for your system:

https://reactnative.dev/docs/environment-setup

The Mobile App has been developed using Node.js v14.3.0 and
npm version 6.14.4, thus it is strongly recommended 
to download the same versions.
Once you download the folder you need to install dependecies
by running:
    
    npm install
    
After that you need to run the Metro Bundler. If you want
to know more about Metro check: 

https://facebook.github.io/metro/ 

So type in a terminal:
    
    react-native start
    
Finally install and run the application in a mobile
phone or in a Android emulator typing:
 
    react-native run-android
    
## General description

The mobile app communicates with the backend API for expressing the Ahmet's
functionalities in a more lean manner. All functionalities are intact, except
for the creation of a new study that is left to the Webapp.
