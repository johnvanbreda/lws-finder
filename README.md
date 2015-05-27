# lws-finder
Local Wildlife Site finder module for Drupal.

## Introduction

A module for Drupal 7 which provides an Indicia powered map of local wildlife sites and allows the user to browse them.
The user is redirected to standard Drupal content pages when they want to view the details of a site.

## Prerequisites

To use this module you need:

1. A location type on the warehouse containing a list of boundaries for districts in your area.
2. A location type on the warehouse containing a list of boundaries for parishes in your area.
3. A location type on the warehouse containing a list of boundaries for local wildlife sites in your area.
4. A Drupal content type for local wildlife sites, with pages created to show details for local wildlife sites. The page
   titles should uniquely identify the site and should be constructed using the location id, code and name from the matching
   sites stored on Indicia. For example, you might like to name the Drupal nodes using the format *code* - *name*.
5. Create a content field against your local wildlife site content type to store the condition of each site. This should
   be a select field with a list of allowed values, or a term reference linked to a Drupal taxonomy containing the
   available options for the site condition field. The site condition will then be provided as a filter option on the
   page.

## Installation

1. Use GitHub to download the zip file and unzip it, or clone to your local machine.
2. Create a folder in sites/all/modules called lws_finder and copy the files into it.
3. Use your Drupal admin login to visit the Modules page and install the **Local Wildlife Sites finder** module using
   the normal process for installing Drupal modules.
4. Create a page with the following blocks on it (this can be a Panels page rather than a content page): LWS Finder
   filter pane, LWS Finder map pane, LWS Finder click info pane. Typically you will want the map pane to be in the
   largest space on the page, so use perhaps use a 2 column layout with widths set to 1/3 and 2/3, then put the filter
   pane and click info pane in the first column and the map into the second column.
5. Save the page. You should get a warning "Unable to show LWS blocks as the block configuration is incomplete".
6. Configure the filter pane block (using Drupal 7's admin overlay menu, or via Structure > Blocks on the menu). Set the
   values for the 3 location types, the content type for local wildlife sites and the fieldname for condition data
   (field_* as defined for the content type used to store local wildlife sites on Drupal). Set the configuration for the
   node title template to allow the code to construct the titles of your Drupal site nodes from the Indicia location
   data. Save the block.
7. Now, visit your panel page. You should be able to browse and select the local wildlife sites on the map. When a site
   is selected, the node teaser is displayed in the click info pane. You might like to configure the display of the
   site's content type teaser display to adjust how this is appeared (e.g. to include or exclude pictures and other
   fields).
