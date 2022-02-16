import React, {useState} from 'react';

function User(props) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (event) => {
    event.preventDefault();

    props.clickCallback(props.id);
    setIsClicked(!isClicked);
  }

  return (
    <button
      className={ `User ${isClicked? 'clicked' : null}` }
      onClick={ event => handleClick(event) }
    >
      <p className='username'>{ props.username }</p>
    </button>
  );
}

export default User;