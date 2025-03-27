import React, { Component } from 'react'

export class NewsItem extends Component {
  
  render() {
    let {title,description,imageurl,newsUrl,author,date,source} = this.props;
    return (
      <div className="my-3">
        <div className="card">
          <span className="position-absolute top-0 translate-middle badge rounded-pill bg-danger" style={{left:"90%",zIndex:'1'}}>{source}</span>
          <img src={!imageurl?"https://eu-images.contentstack.com/v3/assets/blt23eb5bbc4124baa6/bltf6085a50bd0335b6/66aca2b90aa92c56ea3983de/Intel_Robert_Noyce_building_in_the_rain.jpg?disable=upscale&width=1200&height=630&fit=crop":imageurl} className="card-img-top" alt="..." />
            <div className="card-body">
              <h5 className="card-title">{title}<span className="badge bg-secondary">New</span></h5>
              <p className="card-text">{description}</p>
              <p className="card-text"><small className="text-muted">By {!author?"Unknown":author} on {new Date(date).toGMTString()} </small></p>
              <a href={newsUrl} rel="noreferrer" target='_blank' className="btn btn-sm btn-dark">Read More</a>
            </div>
        </div>
      </div>
    )
  }
}

export default NewsItem