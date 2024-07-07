import React from 'react';
import { v4 as uuid } from 'uuid';
import PropTypes from 'prop-types';
import './card.css';

const Card = ({ url, title, description }) => {
	return (
		<div className='card '>
			<div className='card__inner'>
			<div className='card__icon'>
			<a href={url} target="_blank" rel="noopener noreferrer">
            <img src="./img/lien.png" alt={title}  className="smallImage"/>
            </a>
            </div>
			<div className='card__title'>{title}</div>
			<div className='card__description'>
			{description}	
			</div>
			</div>
		</div>
	);
};

Card.propTypes = {
	url: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
};

export default Card;
