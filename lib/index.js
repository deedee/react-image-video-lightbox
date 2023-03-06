"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var React = _interopRequireWildcard(require("react"));

var utils = _interopRequireWildcard(require("./utils"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var MIN_SCALE = 1;
var MAX_SCALE = 4;
var SETTLE_RANGE = 0.001;
var ADDITIONAL_LIMIT = 0.2;
var DOUBLE_TAP_THRESHOLD = 300;
var ANIMATION_SPEED = 0.04;
var RESET_ANIMATION_SPEED = 0.08;
var INITIAL_X = 0;
var INITIAL_Y = 0;
var INITIAL_SCALE = 1;
var MOBILE_ICON_SIZE = 35;
var DESKTOP_ICON_SIZE = 50;

var ReactImageVideoLightbox = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(ReactImageVideoLightbox, _React$Component);

  function ReactImageVideoLightbox(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.state = {
      x: INITIAL_X,
      y: INITIAL_Y,
      scale: INITIAL_SCALE,
      width: window.innerWidth,
      height: window.innerHeight,
      index: _this.props.startIndex,
      swiping: false,
      loading: true,
      iconSize: window.innerWidth <= 500 ? MOBILE_ICON_SIZE : DESKTOP_ICON_SIZE
    };
    _this.width = window.innerWidth;
    _this.height = window.innerHeight;
    _this.handleTouchStart = _this.handleTouchStart.bind(_assertThisInitialized(_this));
    _this.handleTouchMove = _this.handleTouchMove.bind(_assertThisInitialized(_this));
    _this.handleTouchEnd = _this.handleTouchEnd.bind(_assertThisInitialized(_this));
    _this.onNavigationCallback = _this.props.onNavigationCallback && typeof _this.props.onNavigationCallback === 'function' ? _this.props.onNavigationCallback : function () {};
    return _this;
  }

  var _proto = ReactImageVideoLightbox.prototype;

  _proto.zoomTo = function zoomTo(scale) {
    var _this2 = this;

    var frame = function frame() {
      if (_this2.state.scale === scale) return;
      var distance = scale - _this2.state.scale;
      var targetScale = _this2.state.scale + ANIMATION_SPEED * distance;

      _this2.zoom(utils.settle(targetScale, scale, SETTLE_RANGE));

      _this2.animation = requestAnimationFrame(frame);
    };

    this.animation = requestAnimationFrame(frame);
  };

  _proto.reset = function reset() {
    var _this3 = this;

    var frame = function frame() {
      if (_this3.state.scale === INITIAL_SCALE && _this3.state.x === INITIAL_X && _this3.state.y === INITIAL_Y) return;
      var scaleDelta = INITIAL_SCALE - _this3.state.scale;
      var targetScale = utils.settle(_this3.state.scale + RESET_ANIMATION_SPEED * scaleDelta, INITIAL_SCALE, SETTLE_RANGE);
      var nextWidth = _this3.width * targetScale;
      var nextHeight = _this3.height * targetScale;

      _this3.setState({
        scale: targetScale,
        width: nextWidth,
        height: nextHeight,
        x: INITIAL_X,
        y: INITIAL_Y
      }, function () {
        _this3.animation = requestAnimationFrame(frame);
      });
    };

    this.animation = requestAnimationFrame(frame);
  };

  _proto.handleTouchStart = function handleTouchStart(event) {
    this.animation && cancelAnimationFrame(this.animation);
    if (event.touches.length === 2) this.handlePinchStart(event);
    if (event.touches.length === 1) this.handleTapStart(event);
  };

  _proto.handleTouchMove = function handleTouchMove(event) {
    if (event.touches.length === 2) this.handlePinchMove(event);
    if (event.touches.length === 1) this.handlePanMove(event);
  };

  _proto.handleTouchEnd = function handleTouchEnd(event) {
    if (event.touches.length > 0) return null;
    if (this.state.scale > MAX_SCALE) return this.zoomTo(MAX_SCALE);
    if (this.state.scale < MIN_SCALE) return this.zoomTo(MIN_SCALE);

    if (this.lastTouchEnd && this.lastTouchEnd + DOUBLE_TAP_THRESHOLD > event.timeStamp) {
      this.reset();
    }

    if (this.state.swiping && this.state.scale === 1) {
      this.handleSwipe(event);
    }

    this.lastTouchEnd = event.timeStamp;
  };

  _proto.handleSwipe = function handleSwipe(event) {
    var swipeDelta = event.changedTouches[0].clientX - this.swipeStartX;

    if (swipeDelta < -(this.width / 3)) {
      this.swipeRight();
    } else if (swipeDelta > this.width / 3) {
      this.swipeLeft();
    } else {
      this.reset();
    }
  };

  _proto.swipeLeft = function swipeLeft() {
    var _this4 = this;

    var currentIndex = this.state.index;

    if (currentIndex > 0) {
      setTimeout(function () {
        _this4.setState({
          index: currentIndex - 1,
          swiping: false,
          x: INITIAL_X,
          loading: true
        }, function () {
          return _this4.onNavigationCallback(currentIndex - 1);
        });
      }, 500);
    } else {
      this.reset();
    }
  };

  _proto.swipeRight = function swipeRight() {
    var _this5 = this;

    var currentIndex = this.state.index;

    if (currentIndex < this.props.data.length - 1) {
      setTimeout(function () {
        _this5.setState({
          index: currentIndex + 1,
          swiping: false,
          x: INITIAL_X,
          loading: true
        }, function () {
          return _this5.onNavigationCallback(currentIndex + 1);
        });
      }, 500);
    } else {
      this.reset();
    }
  };

  _proto.handleTapStart = function handleTapStart(event) {
    this.swipeStartX = event.touches[0].clientX;
    this.swipeStartY = event.touches[0].clientY;

    if (this.state.scale === 1) {
      this.setState({
        swiping: true
      });
    }
  };

  _proto.handlePanMove = function handlePanMove(event) {
    if (this.state.scale === 1) {
      this.setState({
        x: event.touches[0].clientX - this.swipeStartX
      });
    } else {
      event.preventDefault();
      this.setState({
        x: event.touches[0].clientX - this.swipeStartX,
        y: event.touches[0].clientY - this.swipeStartY
      });
    }
  };

  _proto.handlePinchStart = function handlePinchStart(event) {
    var pointA = utils.getPointFromTouch(event.touches[0]);
    var pointB = utils.getPointFromTouch(event.touches[1]);
    this.lastDistance = utils.getDistanceBetweenPoints(pointA, pointB);
  };

  _proto.handlePinchMove = function handlePinchMove(event) {
    event.preventDefault();
    var pointA = utils.getPointFromTouch(event.touches[0]);
    var pointB = utils.getPointFromTouch(event.touches[1]);
    var distance = utils.getDistanceBetweenPoints(pointA, pointB);
    var scale = utils.between(MIN_SCALE - ADDITIONAL_LIMIT, MAX_SCALE + ADDITIONAL_LIMIT, this.state.scale * (distance / this.lastDistance));
    this.zoom(scale);
    this.lastDistance = distance;
  };

  _proto.zoom = function zoom(scale) {
    var nextWidth = this.width * scale;
    var nextHeight = this.height * scale;
    this.setState({
      width: nextWidth,
      height: nextHeight,
      scale: scale
    });
  };

  _proto.getResources = function getResources() {
    var _this6 = this;

    var items = [];
    var data = this.props.data;

    for (var i = 0; i < data.length; i++) {
      var resource = data[i];

      if (resource.type === 'photo') {
        items.push( /*#__PURE__*/React.createElement("img", {
          key: i,
          alt: resource.altTag,
          src: resource.url,
          style: {
            pointerEvents: this.state.scale === 1 ? 'auto' : 'none',
            maxWidth: '100%',
            maxHeight: '100%',
            transform: "translate(" + this.state.x + "px, " + this.state.y + "px) scale(" + this.state.scale + ")",
            transition: 'transform 0.5s ease-out'
          },
          onLoad: function onLoad() {
            _this6.setState({
              loading: false
            });
          }
        }));
      }

      if (resource.type === 'video') {
        items.push( /*#__PURE__*/React.createElement("iframe", {
          key: i,
          width: "560",
          height: "315",
          src: resource.url,
          frameBorder: "0",
          allow: "autoplay; encrypted-media",
          title: resource.title,
          allowFullScreen: true,
          style: {
            pointerEvents: this.state.scale === 1 ? 'auto' : 'none',
            maxWidth: '100%',
            maxHeight: '100%',
            transform: "translate(" + this.state.x + "px, " + this.state.y + "px)",
            transition: 'transform 0.5s ease-out'
          },
          onLoad: function onLoad() {
            _this6.setState({
              loading: false
            });
          }
        }));
      }
    }

    return items;
  };

  _proto.UNSAFE_componentWillMount = function UNSAFE_componentWillMount() {
    var _this7 = this;

    window.addEventListener('resize', function () {
      if (window.innerWidth <= 500) {
        _this7.setState({
          iconSize: MOBILE_ICON_SIZE
        });
      } else {
        _this7.setState({
          iconSize: DESKTOP_ICON_SIZE
        });
      }
    });
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    var _this8 = this;

    window.removeEventListener('resize', function () {
      if (window.innerWidth <= 500) {
        _this8.setState({
          iconSize: MOBILE_ICON_SIZE
        });
      } else {
        _this8.setState({
          iconSize: DESKTOP_ICON_SIZE
        });
      }
    });
  };

  _proto.render = function render() {
    var _this9 = this;

    var resources = this.getResources();
    return /*#__PURE__*/React.createElement("div", {
      onTouchStart: this.handleTouchStart,
      onTouchMove: this.handleTouchMove,
      onTouchEnd: this.handleTouchEnd,
      style: {
        top: '0px',
        left: '0px',
        overflow: 'hidden',
        position: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,1)',
        zIndex: '1000'
      }
    }, this.props.showResourceCount && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: '0px',
        left: '0px',
        padding: '15px',
        color: 'white',
        fontWeight: 'bold'
      }
    }, /*#__PURE__*/React.createElement("span", null, this.state.index + 1), " / ", /*#__PURE__*/React.createElement("span", null, this.props.data.length)), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: '0px',
        left: '70px',
        padding: '15px',
        color: 'white',
        fontWeight: 'bold',
        zIndex: '9999'
      }
    }, /*#__PURE__*/React.createElement("span", null, this.props.data[this.state.index].tanggal)), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: '0px',
        right: '0px',
        padding: '10px',
        color: '#FFFFFF',
        cursor: 'pointer',
        fontSize: this.state.iconSize * 0.8 + "px",
        zIndex: '9998'
      },
      onClick: this.props.onCloseCallback
    }, /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      height: "36px",
      viewBox: "0 0 24 24",
      width: "36px",
      fill: "#FFFFFF"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M0 0h24v24H0z",
      fill: "none"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
    }))), this.state.index + 1 != 1 ? /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '0px',
        zIndex: 1,
        color: '#FFFFFF',
        cursor: 'pointer',
        fontSize: this.state.iconSize + "px"
      },
      onClick: function onClick() {
        _this9.swipeLeft();
      }
    }, /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      height: "48px",
      viewBox: "0 0 24 24",
      width: "48px",
      fill: "#FFFFFF"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M0 0h24v24H0z",
      fill: "none"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
    }))) : /*#__PURE__*/React.createElement(React.Fragment, null), this.state.index + 1 != this.props.data.length ? /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: '0px',
        zIndex: 1,
        color: '#FFFFFF',
        cursor: 'pointer',
        fontSize: this.state.iconSize + "px"
      },
      onClick: function onClick() {
        _this9.swipeRight();
      }
    }, /*#__PURE__*/React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      height: "48px",
      viewBox: "0 0 24 24",
      width: "48px",
      fill: "#FFFFFF"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M0 0h24v24H0z",
      fill: "none"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
    }))) : /*#__PURE__*/React.createElement(React.Fragment, null), this.state.loading && /*#__PURE__*/React.createElement("div", {
      style: {
        margin: 'auto',
        position: 'fixed'
      }
    }, /*#__PURE__*/React.createElement("style", null, "@keyframes react_image_video_spinner {\n                  0% {\n                    transform: translate3d(-50 %, -50 %, 0) rotate(0deg);\n                  }\n                  100% {\n                    transform: translate3d(-50%, -50%, 0) rotate(360deg);\n                  }\n                }"), /*#__PURE__*/React.createElement("div", {
      style: {
        animation: '1.0s linear infinite react_image_video_spinner',
        border: 'solid 5px #ffffff',
        borderBottomColor: '#cfd0d1',
        borderRadius: '50%',
        height: 30,
        width: 30,
        position: 'fixed',
        transform: 'translate3d(-50%, -50%, 0)'
      }
    })), resources[this.state.index]);
  };

  return ReactImageVideoLightbox;
}(React.Component);

var _default = ReactImageVideoLightbox;
exports["default"] = _default;
module.exports = exports.default;