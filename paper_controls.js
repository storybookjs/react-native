import React from 'react';

export class PaperControls extends React.Component {
  render() {
    const paperNames = this.getPaperNames();
    const mainStyle = {
      fontFamily: '"Helvetica Neue", Helvetica, "Segoe UI", Arial, freesans, sans-serif',
      paddingRight: '10px',
      color: "#444"
    };

    const h1Style = {
      textTransform: 'uppercase',
    };

    return (
      <div style={mainStyle}>
        <h3 style={h1Style}>Available Papers</h3>
        <div>
          {paperNames.map(this.renderPaper.bind(this))}
        </div>
      </div>
    )
  }

  renderPaper(paper) {
    const paperStyle = {
      fontSize: 16,
      padding: '10px 0px',
      cursor: 'pointer',
      borderBottom: '1px solid #EEE'
    };

    const {selectedPaper} = this.props;
    if (paper === selectedPaper) {
      const blockNames = this.getBlocks(selectedPaper);
      paperStyle.fontWeight = 'bold';
      return (
        <div key={paper}>
          <div
            style={paperStyle}
            onClick={this.fireOnPaper.bind(this, paper)}
            >{paper}</div>
          <div>
            {blockNames.map(this.renderBlock.bind(this))}
          </div>
        </div>
      );
    }

    return (<div
      key={paper}
      style={paperStyle}
      onClick={this.fireOnPaper.bind(this, paper)}
      >{paper}</div>);
  }

  renderBlock(block) {
    const {selectedBlock} = this.props;
    const blockStyle = {
      fontSize: 14,
      padding: '8px 0px 8px 3px',
      cursor: 'pointer',
    };

    if (block === selectedBlock) {
      blockStyle.fontWeight = 'bold';
    }
    return (<div
      key={block}
      style={blockStyle}
      onClick={this.fireOnBlock.bind(this, block)}
      >{block}</div>);
  }

  getPaperNames() {
    const {papers} = this.props;
    if (!papers) {
      return [];
    }

    return Object.keys(papers);
  }

  getBlocks(paperName) {
    const {papers} = this.props;
    const blocks = papers[paperName];
    return Object.keys(blocks);
  }

  fireOnPaper(paper) {
    const {onPaper = function() {}} = this.props;
    onPaper(paper);
  }

  fireOnBlock(block) {
    const {onBlock = function() {}} = this.props;
    onBlock(block);
  }
}
