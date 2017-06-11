import React from 'react';
import { Link } from 'react-router';
import './style.css';

const MainLinks = () =>
  <div id="main-links" className="row">
    <div className="col-md-12">
      <div className="row">
        <div className="main-links-container">
          <div className="col-xs-6 try-now">
            <h2>Try Now</h2>
            <pre>
              <code>
                npm i -g @storybook/cli<br />
                cd my-react-app<br />
                getstorybook<br />
              </code>
            </pre>
          </div>

          <div className="col-xs-6 read-docs">
            <h2>Read Docs</h2>
            <div className="">
              <input type="search" className="form-control" id="search" placeholder="Search" />
              <Link to="/basics/introduction/">
                <svg version="1.1" x="0px" y="0px" viewBox="0 0 60 60">
                  <g>
                    <path d="M53.707,58.293L51,55.586v-35l-0.497-0.497L46,15.586V0H6v52h5v5h38.586l2.707,2.707C52.488,59.902,52.744,60,53,60s0.512-0.098,0.707-0.293C54.098,59.316,54.098,58.684,53.707,58.293z M47.586,20H36V8.414l10,10L47.586,20z M8,50V2h36v11.586l-8.089-8.089L35.414,5H11v45H8z M13,55v-3V7h21v15h15v31.586l-7.514-7.514c1.74-2.06,2.795-4.717,2.795-7.619c0-6.522-5.306-11.828-11.828-11.828s-11.828,5.306-11.828,11.828s5.306,11.828,11.828,11.828c2.902,0,5.559-1.055,7.619-2.795L47.586,55H13z M32.453,48.281c-5.419,0-9.828-4.409-9.828-9.828s4.409-9.828,9.828-9.828s9.828,4.409,9.828,9.828S37.872,48.281,32.453,48.281z" />
                    <path d="M26.625,36h6c0.553,0,1-0.447,1-1s-0.447-1-1-1h-6c-0.553,0-1,0.447-1,1S26.072,36,26.625,36z" />
                    <path d="M38.625,40h-12c-0.553,0-1,0.447-1,1s0.447,1,1,1h12c0.553,0,1-0.447,1-1S39.178,40,38.625,40z" />
                  </g>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>;

export default MainLinks;
