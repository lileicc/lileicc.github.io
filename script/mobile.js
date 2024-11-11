(function ($) {
  'use strict';

  /**
   * Mobile Header Navigation
   * ===
   */


  /**
   * Nav Tray Controls
   * ---
   */

  // Mobile Navigation Toggle
  var $site_wrap = $('body');
  var $mobile_nav_tray = $('.mobile-nav-tray');
  var $mobile_nav_tray_links = $mobile_nav_tray.find('a, input[type="search"], button');
  var $mobile_nav_toggle = $('.js-toggle-nav');

  var $nav_focusable_inputs = $mobile_nav_tray_links.not('[disabled]');
  var $nav_first_input  = $nav_focusable_inputs.first();
  var $nav_last_input   = $nav_focusable_inputs.last();

  // Disable links by default
  $mobile_nav_tray_links.attr( 'tabindex', '-1' );

  $mobile_nav_toggle.on('click', function () {
    toggleNav();
  });

  function toggleNav() {
    $site_wrap.toggleClass( 'show-nav' );

    if ( $site_wrap.hasClass( 'show-nav' )) {
      // Expand tray
      $mobile_nav_toggle.attr( 'aria-expanded', 'true' );
      $mobile_nav_tray.attr( 'aria-hidden', 'false' );
      $mobile_nav_tray_links.attr( 'tabindex', 0 );

      // Lock tabbing to links inside tray
      $nav_focusable_inputs = $mobile_nav_tray_links.not('[disabled]');
      $nav_last_input.on( 'keydown', nav_last_focus_lock );
      $nav_first_input.on( 'keydown', nav_first_focus_lock );
    } else {
      // Collapse tray
      $mobile_nav_toggle.attr( 'aria-expanded', 'false' );
      $mobile_nav_tray.attr( 'aria-hidden', 'true' );
      $mobile_nav_tray_links.attr( 'tabindex', '-1' );

      // Unlock tabbing
      $nav_last_input.off( 'keydown', nav_last_focus_lock );
      $nav_first_input.off( 'keydown', nav_first_focus_lock );
    }
  }

  // Hide nav/contact if open and window is resized above 760
  $(window).resize(function () {
    if ( $(window).width() > 760 ) {
      // Collapse tray
      $site_wrap.removeClass('show-nav');
      $mobile_nav_toggle.attr( 'aria-expanded', 'false' );
      $mobile_nav_tray.attr( 'aria-hidden', 'true' );
      $mobile_nav_tray_links.attr( 'tabindex', '-1' );

      // Unlock tabbing
      $nav_last_input.off( 'keydown', nav_last_focus_lock );
      $nav_first_input.off( 'keydown', nav_first_focus_lock );
    }
  });

  // Loop to last input when shift + tabbing
  function nav_first_focus_lock( e ) {
    if ( e.which === 9 && e.shiftKey ) {
      $nav_last_input.focus();
      return false;
    }
  }

  // Loop to first input when tabbing off last input
  function nav_last_focus_lock( e ) {
    if ( e.which === 9 && ! e.shiftKey ) {
      $nav_first_input.focus();
      return false;
    }
  }



  /**
   * Sub Menu Controls
   * ---
   * Click a top level item to display the sub-menu
   */

  var $mobile_nav = $('.navigation--mobile');
  var $active_mobile_nav_item = $mobile_nav.find( '.current-page-ancestor > a' );

  // Set initial active state
  $active_mobile_nav_item
    .addClass( 'is-active' )
    .next( '.sub-menu' )
    .css( 'display', 'block' );

  // Set initial aria attrs
  $active_mobile_nav_item
    .parent( '.current-page-ancestor' )
    .attr( 'aria-expanded', 'true' );

  // Delegate the click event to bind the changing ':not(.is-active)' selector
  $mobile_nav.on('click', '.menu-item-has-children > a:not(.is-active)', function () {
    var $this_link    = $(this);
    var $this_parent  = $this_link.parent();
    var $sub_menu     = $this_link.siblings('.sub-menu');

    var $sibling_parents = $this_link.closest('li')
      .siblings('.menu-item-has-children');

    var $sibling_links = $sibling_parents.find('> a');

    var $sibling_sub_menus = $this_link.closest('li')
      .siblings('.menu-item-has-children')
      .find('> .sub-menu');

    $sibling_links.removeClass('is-active');
    $this_link.addClass('is-active');

    $sibling_parents.attr( 'aria-expanded', 'false' );
    $this_parent.attr( 'aria-expanded', 'true' );

    $sibling_sub_menus.slideUp('800');
    $sub_menu.slideDown('800');

    return false;
  });

})(jQuery);
