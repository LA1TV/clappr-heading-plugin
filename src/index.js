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
    this._enabled = false
    this._renderPlugin()

    // so that it fades in on load
    this._enableTimeoutId = setTimeout(() => {
      this._enableTimeoutId = null
      this._enabled = true
      this._renderPlugin()
    }, 0)
  }

  bindEvents() {
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
    var show = this._enabled && (this._stopped || this._mediaControlVisible)
    this._$headingContainer.attr("data-visible", show ? "1" : "0")
  }

  _appendElToContainer() {
    this.core.mediaControl.container.$el.append(this.el)
  }

  render() {
    var $el = $(this.el)
    var txt = this._getOptions().text
    var link = this._getOptions().hyperlink
    var $container = $("<div />").addClass("heading-container").attr("data-visible", "0")
    this._$headingContainer = $container
    if (link) {
      $container.attr("data-clickable", "1")
      $container.click((e) => {
        // pause if something playing
        this.core.mediaControl.container.pause()
        var resolvedLink = typeof(link) === "function" ? link() : link
        if (this._getOptions().openInNewWindow) {
          window.open(resolvedLink, "_blank")
        }
        else {
          window.location = resolvedLink
        }
        e.preventDefault()
        e.stopImmediatePropagation()
      })
    }
    var $headingTxt = $("<span />").addClass("heading-txt").text(txt)
    $container.append($headingTxt)
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