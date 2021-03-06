/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState } from 'draft-js';

import LayoutComponent from './Component';

export default class History extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    editorState: PropTypes.object,
    modalHandler: PropTypes.object,
    config: PropTypes.object,
    translations: PropTypes.object,
  };

  state: Object = {
    expanded: false,
    undoDisabled: false,
    redoDisabled: false,
  };

  componentWillMount(): void {
    const { editorState, modalHandler } = this.props;
    if (editorState) {
      this.setState({
        undoDisabled: editorState.getUndoStack().size === 0,
        redoDisabled: editorState.getRedoStack().size === 0,
      });
    }
  }

  componentWillReceiveProps(properties: Object): void {
    if (properties.editorState &&
      this.props.editorState !== properties.editorState) {
      this.setState({
        undoDisabled: properties.editorState.getUndoStack().size === 0,
        redoDisabled: properties.editorState.getRedoStack().size === 0,
      });
    }
  }

  onChange: Function = (action) => {
    const { editorState, onChange } = this.props;
    const newState = EditorState[action](editorState);
    if (newState) {
      onChange(newState);
    }
  }

  doExpand: Function = (): void => {
    this.setState({
      expanded: true,
    });
    setTimeout(() => {
      this.props.modalHandler.registerCallBack(this.doCollapse);
    }, 0);
  };

  doCollapse: Function = (): void => {
    this.setState({
      expanded: false,
    });
    this.props.modalHandler.dregisterCallBack(this.doCollapse);
  };

  render(): Object {
    const { config, translations } = this.props;
    const { undoDisabled, redoDisabled, expanded } = this.state;
    const HistoryComponent = config.component || LayoutComponent;
    return (
      <HistoryComponent
        config={config}
        translations={translations}
        currentState={{ undoDisabled, redoDisabled }}
        expanded={expanded}
        onExpandEvent={this.doExpand}
        doExpand={this.doExpand}
        doCollapse={this.doCollapse}
        onChange={this.onChange}
      />
    );
  }
}
