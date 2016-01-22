import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Template extends Component {
    render() {
        return (
            <div>
              <header className="header">
                <row>
                  <column cols="2">
                    <Link to="/"><h2>AbosUr</h2></Link>
                  </column>
                </row>
              </header>
              <div className="container">
                {this.props.children}
              </div>
              <footer className="footer">
                <row>
                  <column cols="12">
                    <p>&copy;&ensp;2016&ensp;Aapo Hanski</p>
                  </column>
                </row>
              </footer>
            </div>
        );
    }
};
