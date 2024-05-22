import React from "react";

function Card(props) {
  return (
    <>
      <div className={`card text-justify shadow-lg text-center ${props.class}`} style={{ width: "15rem" }}>
        <div className="card-body">
          <h5 className="card-title">{props.title}</h5>
          <p className="card-text">{props.text}</p>
          <a className="btn btn-primary" onClick={props.function}>{props.button}</a>
        </div>
      </div>
    </>
  );
}

export default Card;
