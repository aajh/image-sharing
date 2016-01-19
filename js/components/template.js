import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Template extends Component {
    render() {
        return (
            <div>
              <div className="header">
                <row>
                  <column cols="1">
                    <Link to="/"><h2>AbosUr</h2></Link>
                  </column>
                </row>
              </div>
              <div className="container">
                {this.props.children}
              </div>
            </div>
        );
    }
};
