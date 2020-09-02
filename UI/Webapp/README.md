# Ahmet web application

The Web app is the web front-end for the Ahmet's API. It exposes
functionalities by leveraging JavaScript and React framework.


## Table of contents

1. [Project structure](#project-structure)
2. [Installation and startup](#installation-and-startup)
3. [General description](#general-description)
4. [Main features](#main-features)


## Project structure

    /Webapp: folder containing the web application
    |     
    |--> /src:
    |      |--> /components: folder containing components shared within the App.
    |      |       |--> /Cards:
    |      |       |--> /Charts:
    |      |       |--> /Errors:
    |      |       |--> /Fetcher:
    |      |       |--> /Footer:
    |      |       |--> /Loading:
    |      |       |--> /Navbar:        
    |      |       |--> /Parameters: 
    |      |       |--> /Sidebar:
    |      |       |--> /Steps:     
    |      |
    |      |--> /views: folder containing all the files for rendering the app
    |      |       |    views.
    |      |       |--> Home.jsx:
    |      |       |--> Login.jsx:
    |      |       |--> Logout.jsx:
    |      |       |--> NewStudy.jsx:
    |      |       |--> Statistics.jsx:
    |      |       |--> Studies.jsx:
    |      |       |--> Swagger.jsx:    
    |      |
    |      |--> /assets: folder containing the CSS, SASS and fonts.
    |      |--> index.jsx: web app entrypoint.
    |      |--> routes.js: file containing the list of the application routes.
    |
    |--> /public: generic folder containing the HTML skeleton and other
    |             secondary files.
    |--> /Images: README images.



## Installation and startup

Refer to the outer API README for complete installation of the Web app and
API.


## General description

The web app communicates with the backend API for expressing the Ahmet's
functionalities in a more friendly way.

### Home page

Entry point of the application. The home page gives you a brief overview of
the functionalities available in the framework. In addition to the general
description, the home page provides you the prototypes of the BBO Algorithm,
of the Dataset and of the Metric. You can download these abstract classes
and implement your own algorithm, dataset or metric. Once you have coded them, 
you can submit for revision. After a successful revision, your
algorithms, dataset and metrics will be available along the others.
 
![Home](Images/Home.png?raw=true "Home page")

### New study

The new study page lets you make your own study. Essentially, this page is a
multi-step form that interacts with your decisions and needs for building a
valid study. During the creation of a study, you will pick a BBO algorithm, 
a metric, a dataset and selects the parameters building the searching space. 
  
![Home](Images/NewStudy.png?raw=true "New study")

### Studies

The study page presents you the available studies. You can gather more
information about a study by clicking on a row of the table. Once a study is
 selected, you may decide to start/restart or delete the study. 

![Home](Images/Tables.png?raw=true "Studies")

### Statistics

The statistics page gives insights about the studies. You can see how many
studies are pending, how many trials have been generated and so forth. You
may also decide to specialize the page on a particular study you are
interested in by using the selection form at the top of the page.

![Home](Images/Statistics.png?raw=true "Statistics")


### API docs

The API docs page display the openapi specification of the backend API.
You can refer to it for interacting directly with the API. 

![Home](Images/OpenAPI.png?raw=true "API docs")


## Main features

- **Single Page Application** paradigm.
- **Login** for getting the token and storing it in the session storage of
 the browser.
- **Fetcher** for centralizing access to the API.
- **Multi-step form** for creating new studies.
- **Polling requests** with browser timer for checking studies status.
- **Charts**.
