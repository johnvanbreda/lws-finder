var lws_click;

jQuery(document).ready(function($) {

  function putOnMap(locationId) {
    var reportRequest = indiciaData.reportRequestPath + 'report=library/locations/locations_list_mapping.xml&callback=?' +
    '&id=' + locationId + '&location_type_id=';
    $.getJSON(reportRequest,
      null,
      function (response, textStatus, jqXHR) {
        var p = new OpenLayers.Format.WKT(),
          f = p.read(response[0].geom);
        indiciaData.mapdiv.map.editLayer.removeAllFeatures();
        indiciaData.mapdiv.map.editLayer.addFeatures([f]);
        indiciaData.mapdiv.map.zoomToExtent(indiciaData.mapdiv.map.editLayer.getDataExtent());
      }
    );
  }

  /**
   * Limits the parishes or sites in a drop down list to the parent in the site hierarchy.
   * @param string type Which select type is being limited, lws, parish or district?
   * @param integer locationId Warehouse location ID
   * @param integer locationTypeId Layer's location type ID.
   */
  function limitSelectTo(type, locationId, locationTypeId) {
    var select = $('#' + type + '-select'), attrs='';
    // Run a report which loads items to add to the select according to the boundary of the parent's locationId
    var reportRequest = indiciaData.reportRequestPath + 'report=library/locations/locations_list_mapping.xml&callback=?&orderby=name' +
        '&parent_boundary_id=' + locationId + '&location_type_id=' + locationTypeId;
    $.getJSON(reportRequest,
      null,
      function (response, textStatus, jqXHR) {
        select.find('option[value^=]').remove();
        $.each(response, function() {
          attrs = type==='lws' ? ' data-code="' + this.code + '"' : '';
          select.append('<option value="' + this.id + '"' + attrs + '>' + this.name + '</option>');
        });
        if (type==='lws') {
          applyConditionClasses();
          applyConditionFilter();
          showOnlySelectedFeatures();
        }
      }
    );
  }

  function applyConditionClasses() {
    var nodeTitle;
    $.each($('#lws-select').find('option[value^=]'), function() {
      nodeTitle = getAnyLwsOptionNodeTitle(this);
      if (typeof indiciaData.siteConditions[nodeTitle]!=="undefined") {
        $(this).addClass('condition-'+indiciaData.siteConditions[nodeTitle].toLowerCase().replace(/[^a-z0-9]/, '_'));
      }
    });
  }

  function showOnlySelectedFeatures() {
    var i, selected=[];
    $.each($('#lws-select').find('option:enabled'), function() {
      selected.push($(this).attr('data-code'));
    });
    for(i = 0; i < indiciaData.reportlayer.features.length; i++) {
      if ($.inArray(indiciaData.reportlayer.features[i].attributes.code, selected)>-1) {
        indiciaData.reportlayer.features[i].style = null;
      } else {
        indiciaData.reportlayer.features[i].style = { display: 'none' };
      }
    }
    indiciaData.reportlayer.redraw();
  }

  function changeDistrict(e) {
    var locationId=$(e.currentTarget).val();
    putOnMap(locationId);
    limitSelectTo('parishes', locationId, indiciaData.parishTypeId);
    limitSelectTo('lws', locationId, indiciaData.lwsTypeId);
  }

  function changeParish(e) {
    var locationId=$(e.currentTarget).val();
    putOnMap(locationId);
    limitSelectTo('lws', locationId, indiciaData.lwsTypeId);
  }

  function applyConditionFilter() {
    var $select = $('#lws-select');
    $select.val('');
    if ($('#lws-condition-select').val()) {
      $select.find('option[value^=]').attr('disabled', true);
      $select.find('option.condition-' + $('#lws-condition-select').val().toLowerCase().replace(/[^a-z0-9]/, '_')).removeAttr('disabled');
    }
    else {
      $select.find('option').removeAttr('disabled');
    }
  }

  function changeCondition() {
    applyConditionFilter();
    showOnlySelectedFeatures();
  }

  function changeLws(e) {
    var locationId=$(e.currentTarget).val();
    if (locationId) {
      putOnMap(locationId);
      $.get(
        Drupal.settings.basePath + '?q=lws_finder/site/teaser&name=' + encodeURIComponent(getSelectedLwsNodeTitle()),
        function (data) {
          $('#lws-click-info').html(data);
        }
      );
    } else {
      $('#lws-click-info').html('');
    }
  }

  /**
   * Returns the expected name of the node associated with the current selected LWS in the select box. This is built
   * from the template defined in block configuration.
   * @returns string
   */
  function getAnyLwsOptionNodeTitle(option) {
    var id = $(option).val(),
      name = $(option).text(),
      code = $(option).attr('data-code');
    return indiciaData.lwsNodeTitleTemplate.replace('{id}', id).replace('{name}', name).replace('{code}', code);
  }

  function getSelectedLwsNodeTitle() {
    return getAnyLwsOptionNodeTitle($('#lws-select').find('option:selected'));
  }

  lws_click = function(features) {
    if (features.length>0) {
      $('#lws-select').find('option[data-code="' + features[0].attributes.code + '"]').attr('selected', true);
      $.get(
        Drupal.settings.basePath + '?q=lws_finder/site/teaser&name=' + encodeURIComponent(getSelectedLwsNodeTitle()),
        function(data) {
          $('#lws-click-info').html(data);
        }
      );
    }
  };

  $('#districts-select').change(changeDistrict);

  $('#parishes-select').change(changeParish);

  $('#lws-condition-select').change(changeCondition);

  $('#lws-select').change(changeLws);

  $('#view-lws').click(function() {
    if ($('#lws-select').val()) {
      // Redirect to a menu path which will lookup and route to the appropriate site node.
      window.location = Drupal.settings.basePath + '/?q=lws_finder/site/route&name=' + encodeURIComponent(getSelectedLwsNodeTitle());
    }
  });

  applyConditionClasses();
});