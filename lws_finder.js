var lws_click;

jQuery(document).ready(function($) {

  function putOnMap(locationId) {
    reportRequest = indiciaData.reportRequestPath + 'report=library/locations/locations_list_mapping.xml&callback=?' +
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
   * @param locationId
   */
  function limitSelectTo(type, locationId, locationTypeId) {
    var select = $('#' + type + '-select'), attrs='';
    // Run a report which loads items to add to the select according to the boundary of the parent's locationId
    reportRequest = indiciaData.reportRequestPath + 'report=library/locations/locations_list_mapping.xml&callback=?' +
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
    var attrs;
    $.each($('#lws-select option'), function() {
      if (typeof indiciaData.siteConditions[$(this).attr('data-nodetitle')]!=="undefined") {
        $(this).addClass(indiciaData.siteConditions[$(this).val()].toLowerCase().replace(/[^a-z0-9]/, '_'));
      }
    });
  }

  function showOnlySelectedFeatures() {
    var i, selected=[];
    $.each($('#lws-select option'), function() {
      selected.push($(this).attr('data-code'));
    });
    for( var i = 0; i < indiciaData.reportlayer.features.length; i++ ) {
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
    $('#lws-select').val('');
    if ($('#lws-condition-select').val()) {
      $('#lws-select').find('option').hide();
      $('#lws-select').find('option.' + $('#lws-condition-select').val().toLowerCase().replace(/[^a-z0-9]/, '_')).show();
    }
    else {
      $('#lws-select').find('option').show();
    }
  }

  function changeLws(e) {
    var locationId=$(e.currentTarget).val();
    if (locationId) {
      putOnMap(locationId);
      $.get(
        Drupal.settings.basePath + '/?q=lws_finder/site/teaser&name=' + encodeURIComponent(getSelectedLwsNodeTitle()),
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
  function getSelectedLwsNodeTitle() {
    var $selected = $('#lws-select option:selected'),
      id = $selected.val(),
      name = $selected.text(),
      code = $selected.attr('data-code');
    return indiciaData.lwsNodeTitleTemplate.replace('{id}', id).replace('{name}', name).replace('{code}', code);
  }

  lws_click = function(features) {
    if (features.length>0) {
      $('#lws-select option[data-code="' + features[0].attributes.code + '"]').attr('selected', true);
      $.get(
        Drupal.settings.basePath + '/?q=lws_finder/site/teaser&name=' + encodeURIComponent(getSelectedLwsNodeTitle()),
        function(data) {
          $('#lws-click-info').html(data);
        }
      );
    }
  }

  $('#districts-select').change(changeDistrict);

  $('#parishes-select').change(changeParish);

  $('#lws-condition-select').change(applyConditionFilter);

  $('#lws-select').change(changeLws);

  $('#view-lws').click(function() {
    if ($('#lws-select').val()) {
      // Redirect to a menu path which will lookup and route to the appropriate site node.
      window.location = Drupal.settings.basePath + '/?q=lws_finder/site/route&name=' + encodeURIComponent(getSelectedLwsNodeTitle());
    }
  });

  applyConditionClasses();
});