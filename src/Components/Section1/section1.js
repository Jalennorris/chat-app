import React from 'react'

import { Link } from 'react-router-dom';
import './section1.css';
import gif from '../../Images/giphy.GIF'
export function Section1() {
    return (
      <div className="section1-container">
        <div className='section1-items'>
         
            <img className='section1-img' alt='gif' src={gif} />
        
          <p className="section1-text">"Join our vibrant community, where connections flourish, conversations thrive, and friendships blossom. Come, be a part of something extraordinary!"</p>
          <Link to={"/login"}><button className="section1-button">Join Us!</button></Link>
        </div>
      </div>
    );
  }