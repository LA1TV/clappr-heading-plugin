import {UICorePlugin, Events} from 'clappr'
import $ from 'jQuery'
import './style.sass'

export default class MarkersPlugin extends UICorePlugin {
  get name() { return 'heading-plugin' }

  get attributes() {
    return {
      'class': this.name
    }
  }

  constructor(core) {
    super(core)
    this._mediaControlVisible = false
    this._stopped = true
    this._ready = false
    var options = this._getOptions()
    this._enabled = typeof(options.enabled) === "undefined" || !!options.enabled
    this._hyperlink = options.hyperlink
    this._text = options.text || ""
    this._openInNewWindow = !!options.openInNewWindow
    this._visible = false
    this._renderPlugin()

    // so that it fades in on load
    this._enableTimeoutId = setTimeout(() => {
      this._enableTimeoutId = null
      this._ready = true
      this._renderPlugin()
    }, 0)
  }

  bindEvents() {
    this._bindContainerEvents()
    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_CONTAINERCHANGED, this._onMediaControlContainerChanged)
  }

  _bindContainerEvents() {
    if (this._oldContainer) {
      this.stopListening(this._oldContainer, Events.CONTAINER_MEDIACONTROL_SHOW, this._onMediaControlShow)
      this.stopListening(this._oldContainer, Events.CONTAINER_MEDIACONTROL_HIDE, this._onMediaControlHide)
      this.stopListening(this._oldContainer, Events.CONTAINER_STOP, this._onStop)
      this.stopListening(this._oldContainer, Events.CONTAINER_ENDED, this._onStop)
      this.stopListening(this._oldContainer, Events.CONTAINER_PLAY, this._onPlay)
    }
    this._oldContainer = this.core.mediaControl.container
    this.listenTo(this.core.mediaControl.container, Events.CONTAINER_MEDIACONTROL_SHOW, this._onMediaControlShow)
    this.listenTo(this.core.mediaControl.container, Events.CONTAINER_MEDIACONTROL_HIDE, this._onMediaControlHide)
    this.listenTo(this.core.mediaControl.container, Events.CONTAINER_STOP, this._onStop)
    this.listenTo(this.core.mediaControl.container, Events.CONTAINER_ENDED, this._onStop)
    this.listenTo(this.core.mediaControl.container, Events.CONTAINER_PLAY, this._onPlay)
  }

  _getOptions() {
    if (!("headingPlugin" in this.core.options)) {
      throw "'headingPlugin' property missing from options object."
    }
    return this.core.options.headingPlugin
  }

  _onMediaControlContainerChanged() {
    this._bindContainerEvents()
    this._appendElToContainer()
  }

  _onStop() {
    this._stopped = true
    this._renderPlugin()
  }

  _onPlay() {
    this._stopped = false
    this._renderPlugin()
  }

  _onMediaControlShow() {
    this._mediaControlVisible = true
    this._renderPlugin()
  }

  _onMediaControlHide() {
    this._mediaControlVisible = false
    this._renderPlugin()
  }

  _renderPlugin() {
    var show = this._ready && this._enabled && (this._stopped || this._mediaControlVisible)
    this._visible = show
    var $container = this._$headingContainer
    this._$headingTxt.text(this._text)
    if (this._hyperlink) {
      $container.attr("data-clickable", "1")
    }
    else {
      $container.attr("data-clickable", "0")
    }
    $container.attr("data-visible", show ? "1" : "0")
  }

  _appendElToContainer() {
    this.core.mediaControl.container.$el.append(this.el)
  }

  setText(newText, newHyperlink=null) {
    this._text = newText
    this._hyperlink = newHyperlink
    this._renderPlugin()
  }

  setEnabled(enabled) {
    this._enabled = !!enabled
    this._renderPlugin()
  }

  setOpenInNewWindow(openInNewWindow) {
    this._openInNewWindow = !!openInNewWindow
  }

  render() {
    var $el = $(this.el)
    var $container = $("<div />").addClass("heading-container").attr("data-visible", "0")
    this._$headingContainer = $container
    $container.click((e) => {
      if (!this._visible || !this._hyperlink) {
        return
      }

      // pause if something playing
      this.core.mediaControl.container.pause()
      var resolvedLink = typeof(this._hyperlink) === "function" ? this._hyperlink() : this._hyperlink
      if (this._openInNewWindow) {
        window.open(resolvedLink, "_blank")
      }
      else {
        window.location = resolvedLink
      }
      e.preventDefault()
      e.stopImmediatePropagation()
    })
    this._$headingTxt = $("<span />").addClass("heading-txt")
    $container.append(this._$headingTxt)
    $el.append($container)
    this._appendElToContainer()
    return this
  }

  destroy() {
    if (this._enableTimeoutId) {
      clearTimeout(this._enableTimeoutId)
      this._enableTimeoutId = null
    }
  }
}