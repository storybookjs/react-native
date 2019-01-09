"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var PropTypes = __importStar(require("prop-types"));
var styled_1 = __importDefault(require("@emotion/styled"));
var core_events_1 = require("@storybook/core-events");
var components_1 = require("@storybook/components");
var markdown_to_jsx_1 = __importDefault(require("markdown-to-jsx"));
var shared_1 = require("./shared");
var Panel = styled_1.default.div({
    padding: 10,
    boxSizing: 'border-box',
    width: '100%',
});
function read(param) {
    if (!param) {
        return undefined;
    }
    else if (typeof param === 'string') {
        return param;
    }
    else if ('disabled' in param) {
        return undefined;
    }
    else if ('text' in param) {
        return param.text;
    }
    else if ('markdown' in param) {
        return param.markdown;
    }
}
var SyntaxHighlighter = function (props) { return React.createElement(components_1.SyntaxHighlighter, __assign({ bordered: true, copyable: true }, props)); };
var NotesPanel = /** @class */ (function (_super) {
    __extends(NotesPanel, _super);
    function NotesPanel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {
            value: '',
        };
        // use our SyntaxHighlighter component in place of a <code> element when
        // converting markdown to react elements
        _this.options = { overrides: { code: SyntaxHighlighter } };
        _this.onStoryChange = function (id) {
            var api = _this.props.api;
            var params = api.getParameters(id, shared_1.PARAM_KEY);
            var value = read(params);
            if (value) {
                _this.setState({ value: value });
            }
            else {
                _this.setState({ value: undefined });
            }
        };
        return _this;
    }
    NotesPanel.prototype.componentDidMount = function () {
        var api = this.props.api;
        api.on(core_events_1.STORY_CHANGED, this.onStoryChange);
    };
    NotesPanel.prototype.componentWillUnmount = function () {
        var api = this.props.api;
        api.off(core_events_1.STORY_CHANGED, this.onStoryChange);
    };
    NotesPanel.prototype.render = function () {
        var active = this.props.active;
        var value = this.state.value;
        if (!active) {
            return null;
        }
        return value ? (React.createElement(Panel, { className: "addon-notes-container" },
            React.createElement(markdown_to_jsx_1.default, { options: this.options }, value))) : (React.createElement(components_1.Placeholder, null, "There is no info/note"));
    };
    NotesPanel.propTypes = {
        active: PropTypes.bool.isRequired,
        api: PropTypes.shape({
            on: PropTypes.func,
            off: PropTypes.func,
            emit: PropTypes.func,
            getParameters: PropTypes.func,
        }).isRequired,
    };
    return NotesPanel;
}(React.Component));
exports.default = NotesPanel;
