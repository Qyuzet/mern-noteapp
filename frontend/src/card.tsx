// @ts-nocheck
import "./App.css";

const Card = (props) => {
  return (
    <>
      <div className="card card-compact bg-base-100 w-44 shadow-xl rounded-2xl">
        <figure>
          <img
            src={props.img}
            alt="Shoes"
            className="aspect-square object-cover"
          />
        </figure>
        <div className="card-body bg-white rounded-b-2xl">
          <h2 className="card-title">{props.title}</h2>
          <p>{props.text}</p>
          <div className="card-actions flex justify-end ">
            <button
              onClick={props.edit}
              className="btn bg-transparent text-black btn-sm"
            >
              Edit
            </button>
            <button
              onClick={props.delete}
              className="btn bg-transparent text-black btn-sm"
            >
              X
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
