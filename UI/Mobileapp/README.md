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


## Inside Mobile Ahmet

###Views

In this folder are placed all files that render the final aspect of the App.

###Screen1

Entry point of the application. The Screen1 represent the home page 
and gives you a brief overview of the functionalities available in the App.

![Home](Images/Home.png?raw=true "Home page")

###Screen2

Is the Studies view. This page presents you the available studies. You can gather more
information about a study by clicking on a row of the table that redirect you to a more specific table. Once a study is
selected, you may decide to start/restart, delete the study osr simply go back to main view of all studies created. 

![Home](Images/Studies.png?raw=true "Studies")

###Screen3

The Statistics view. This page show you the graphs of your studies, how many
studies are pending, how many trials have been generated and so forth. You
may also decide to specialize the page by selecting a particular study you are
interested in.

![Home](Images/Statistics.png?raw=true "Statistics")

###Screen4

Login and Logout. This page allow you to connect to the API using credentials. 

![Home](Images/Login.png?raw=true "Login")

## Demos

![NewStudy](Images/Demo1.gif "Demo")
![NewStudy](Images/Demo2.gif "Demo")
