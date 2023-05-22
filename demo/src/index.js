import React, { Component } from "react";
import { render } from "react-dom";
import axios from 'axios';

import ReactImageVideoLightbox from '../../src';

let data;

export default class AttachmentViewer extends Component {
  state = {
    lightboxOpen: true,
    data: data
  };

  render() {
    return (
          <ReactImageVideoLightbox
            data={this.state.data}
            startIndex={0}
            showResourceCount={true}
           // onCloseCallback={() => this.setState({ lightboxOpen: false })}
            onNavigationCallback={(currentIndex) =>
              console.log(`Current index: ${currentIndex}`)
            }
          />
    );
  }
}

const params = new URLSearchParams(window.location.search);
const t = params.get('t');
const n = params.get('n');
const i = params.get('i');
axios.get(`/geokincia/att/detail/${t}/${n}/${i}`)
.then(result => {
  data = result.data;
  render(<AttachmentViewer />, document.querySelector("#demo"));
});
