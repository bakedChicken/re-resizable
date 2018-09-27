/* @flow */

import * as React from 'react';
import * as ReactDOM from 'react-dom';

const styles = {
  base: {
    position: 'absolute',
    userSelect: 'none',
    MsUserSelect: 'none',
  },
  top: {
    width: '100%',
    height: '10px',
    top: '-5px',
    left: '0px',
    cursor: 'row-resize',
  },
  right: {
    width: '10px',
    height: '100%',
    top: '0px',
    right: '-5px',
    cursor: 'col-resize',
  },
  bottom: {
    width: '100%',
    height: '10px',
    bottom: '-5px',
    left: '0px',
    cursor: 'row-resize',
  },
  left: {
    width: '10px',
    height: '100%',
    top: '0px',
    left: '-5px',
    cursor: 'col-resize',
  },
  topRight: {
    width: '20px',
    height: '20px',
    position: 'absolute',
    right: '-10px',
    top: '-10px',
    cursor: 'ne-resize',
  },
  bottomRight: {
    width: '20px',
    height: '20px',
    position: 'absolute',
    right: '-10px',
    bottom: '-10px',
    cursor: 'se-resize',
  },
  bottomLeft: {
    width: '20px',
    height: '20px',
    position: 'absolute',
    left: '-10px',
    bottom: '-10px',
    cursor: 'sw-resize',
  },
  topLeft: {
    width: '20px',
    height: '20px',
    position: 'absolute',
    left: '-10px',
    top: '-10px',
    cursor: 'nw-resize',
  },
};

export type Direction = 'top' | 'right' | 'bottom' | 'left' | 'topRight' | 'bottomRight' | 'bottomLeft' | 'topLeft';

export type OnResizeStartCallback = (
  e: SyntheticMouseEvent<HTMLDivElement> | SyntheticTouchEvent<HTMLDivElement>,
  dir: Direction,
) => void;

export type OnResizeCallback = (
  e: SyntheticMouseEvent<HTMLDivElement> | SyntheticTouchEvent<HTMLDivElement>
) => void;

export type OnResizeStopCallback = (
  e: SyntheticMouseEvent<HTMLDivElement> | SyntheticTouchEvent<HTMLDivElement>
) => void;

export type Props = {
  direction: Direction,
  className?: string,
  replaceStyles?: { [key: string]: string | number },
  onResizeStart: OnResizeStartCallback,
  onResize: OnResizeCallback,
  onResizeStop: OnResizeStopCallback,
  children: ?React.ChildrenArray<*>,
};

export default class Resizer extends React.Component<Props> {
  componentDidMount() {
    const thisNode = ReactDOM.findDOMNode(this);

    if (thisNode) {
      const { ownerDocument } = thisNode;
      thisNode.addEventListener('mousedown', this.handleMouseDown);
      thisNode.addEventListener('touchstart', this.handleMouseDown);
      ownerDocument.addEventListener('mouseup', this.handleMouseUp);
      ownerDocument.addEventListener('touchend', this.handleMouseUp);
      ownerDocument.addEventListener('mousemove', this.handleMouseMove);
      ownerDocument.addEventListener('touchmove', this.handleMouseMove);
    }
  }

  componentWillUnmount() {
    const thisNode = ReactDOM.findDOMNode(this);

    if (thisNode) {
      const { ownerDocument } = thisNode;
      thisNode.removeEventListener('mousedown', this.handleMouseDown);
      thisNode.removeEventListener('touchstart', this.handleMouseDown);
      ownerDocument.removeEventListener('mouseup', this.handleMouseUp);
      ownerDocument.removeEventListener('touchend', this.handleMouseUp);
      ownerDocument.removeEventListener('mousemove', this.handleMouseMove);
      ownerDocument.removeEventListener('touchmove', this.handleMouseMove);
    }
  }

  handleMouseDown = (e: MouseEvent | TouchEvent) => {
    this.props.onResizeStart(e, this.props.direction);
  };

  handleMouseUp = (e: MouseEvent | TouchEvent) => {
    this.props.onResizeStop(e);
  };

  handleMouseMove = (e: MouseEvent | TouchEvent) => {
    this.props.onResize(e);
  };

  render(): React.Element<'div'> {
    const { className, direction, replaceStyles, children } = this.props;
    return (
      <div
        className={className}
        style={{
          ...styles.base,
          ...styles[direction],
          ...(replaceStyles || {}),
        }}
      >
        {children}
      </div>
    );
  }
}

