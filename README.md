# lws-finder
Local Wildlife Site finder module for Drupal.

## Prerequisites

To use this module you need:

1. A location type on the warehouse containing a list of boundaries for districts in your area.
2. A location type on the warehouse containing a list of boundaries for parishes in your area.
3. A location type on the warehouse containing a list of boundaries for local wildlife sites in your area.
4. A Drupal content type for local wildlife sites, with pages created to show details for local wildlife sites. The page titles should match the site names loaded onto the warehouse.
5. You might like to use a module like Display Suite to configure the appearance of teasers for the local wildlife site pages, since these are shown when a user clicks on a site to view information.

## Installation

1. Use GitHub to download the zip file and unzip it, or clone to your local machine.
2. Create a folder in sites/all/modules called lws_finder and copy the files into it.
3. Use your Drupal admin login to visit the Modules page and install the **Local Wildlife Sites finder** module as usual for Drupal.
4. Create a page with the following blocks on it (this can be a Panels page rather than a content page): LWS FInder filter pane, LWS Finder map pane, LWS Finder click info pane. Typically you will want the map pane to be in the largest space on the page, so use perhaps use a 2 column layout with widths set to 1/3 and 2/3, then put the filter pane and click info pane in the first column and the map into the second column.
5. Save the page. You should get a warning "Unable to show LWS blocks as the block configuration is incomplete".
6. Configure the filter pane block (using Drupal 7's admin overlay menu, or via Structure > Blocks on the menu). Set the values for the 3 location types, the content type for local wildlife sites and the fieldname for condition data (field_* as defined for the content type used to store local wildlife sites on Drupal). Save the block.
7. Now, visit your panel page.
