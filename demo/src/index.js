import React, { Component } from "react";
import { render } from "react-dom";

import ReactImageVideoLightbox from "../../src";

export default class Demo extends Component {
  state = {
    lightboxOpen: false,
    data: [
      {
        url: "https://placekitten.com/450/300",
        type: "photo",
        altTag: "some image",
        tgl: "2010-09-09"
      },
      {
        url: "https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_480_1_5MG.mp4",
        type: "video",
        title: "My Placeholder video",
        tgl: "2010-09-10"
      },
      {
        url: "https://placekitten.com/550/500",
        type: "photo",
        altTag: "some other image",
        tgl: "2010-09-11"
      },
      {
        url: "https://www.youtube.com/embed/ScMzIvxBSi4",
        type: "video",
        title: "some other video",
        tgl: "2010-09-12"
      },
    ]
  };

  render() {
    return (
      <div
        style={{
          fontFamily: "sans-serif",
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1 style={{ textAlign: "center" }}>
          React image &amp; video lightbox demo
        </h1>
        <h3 style={{ textAlign: "center" }}>
          Click the button to view the lightbox
        </h3>
        <div>
          <button
            style={{
              padding: 20,
              border: "none",
              borderRadius: 5,
              backgroundColor: "lightgrey",
            }}
            onClick={() => this.setState({ lightboxOpen: true })}
          >
            Open lightbox
          </button>
        </div>
        {this.state.lightboxOpen && (
          <ReactImageVideoLightbox
            data={this.state.data}
            startIndex={0}
            showResourceCount={true}
            onCloseCallback={() => this.setState({ lightboxOpen: false })}
            onNavigationCallback={(currentIndex) =>
              console.log(`Current index: ${currentIndex}`)
            }
          />
        )}
      </div>
    );
  }
}

render(<Demo />, document.querySelector("#demo"));
