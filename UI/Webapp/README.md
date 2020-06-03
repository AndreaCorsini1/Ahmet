# Ahmet web application

### Description

The web app communicates with the backend API for expressing the Ahmet's
functionalities in a more friendly way.

#### Home page

Entry point of the application. The home page gives you a brief overview of
the functionalities available in the framework. In addition to the general
description, the home page provides you the prototypes of the BBO Algorithm,
of the Dataset and of the Metric. You can download these abstract classes
and implement your own algorithm, dataset or metric. Once you have coded them, 
you can submit for revision. After a successful revision, your
algorithms, dataset and metrics will be available along the others.
 
![Home](Images/Home.png?raw=true "Home page")

#### New study

The new study page lets you make your own study. Essentially, this page is a
multi-step form that interacts with your decisions and needs for building a
valid study. During the creation of a study, you will pick a BBO algorithm, 
a metric, a dataset and selects the parameters building the searching space. 
  
![Home](Images/NewStudy.png?raw=true "New study")

#### Studies

The study page presents you the available studies. You can gather more
information about a study by clicking on a row of the table. Once a study is
 selected, you may decide to start/restart or delete the study. 

![Home](Images/Tables.png?raw=true "Studies")

#### Statistics

The statistics page gives insights about the studies. You can see how many
studies are pending, how many trials have been generated and so forth. You
may also decide to specialize the page on a particular study you are
interested in by using the selection form at the top of the page.

![Home](Images/Statistics.png?raw=true "Statistics")


#### API docs

The API docs page display the openapi specification of the backend API.
You can refer to it for interacting directly with the API. 

![Home](Images/OpenAPI.png?raw=true "API docs")

### Main features
- Login ...
- Fetcher ...
- Multi-step form ...
- Charts ...