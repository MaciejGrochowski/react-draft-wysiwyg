/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState, Modifier } from 'draft-js';
import { getSelectionCustomInlineStyle } from 'draftjs-utils';

import { forEach } from '../../utils/common';
import LayoutComponent from './Component';

export default class Remove extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    editorState: PropTypes.object.isRequired,
    config: PropTypes.object,
    translations: PropTypes.object,
    modalHandler: PropTypes.object,
  };

  state = {
    expanded: false,
  }

  removeInlineStyles: Function = (): void => {
    const { editorState, onChange } = this.props;
    onChange(this.removeAllInlineStyles(editorState));
  };

  removeAllInlineStyles: Function = (editorState: EditorState): void => {
    let contentState = editorState.getCurrentContent();
    [
      'BOLD',
      'ITALIC',
      'UNDERLINE',
      'STRIKETHROUGH',
      'MONOSPACE',
      'SUPERSCRIPT',
      'SUBSCRIPT',
    ].forEach((style) => {
      contentState = Modifier.removeInlineStyle(
        contentState,
        editorState.getSelection(),
        style,
      );
    });
    const customStyles = getSelectionCustomInlineStyle(editorState, ['FONTSIZE', 'FONTFAMILY', 'COLOR', 'BGCOLOR']);
    forEach(customStyles, (key, value) => {
      if (value) {
        contentState = Modifier.removeInlineStyle(
          contentState,
          editorState.getSelection(),
          value,
        );
      }
    });

    return EditorState.push(editorState, contentState, 'change-inline-style');
  };

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
    this.props.modalHandler.deregisterCallBack(this.doCollapse);
  };

  render(): Object {
    const { config, translations } = this.props;
    const { expanded } = this.state;
    const RemoveComponent = config.component || LayoutComponent;
    return (
      <RemoveComponent
        config={config}
        translations={translations}
        expanded={expanded}
        onExpandEvent={this.doExpand}
        doExpand={this.doExpand}
        doCollapse={this.doCollapse}
        onChange={this.removeInlineStyles}
      />
    );
  }
}

// todo: unit test coverage
