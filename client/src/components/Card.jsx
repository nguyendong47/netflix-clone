import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { IoPlayCircleSharp } from 'react-icons/io5';
import { AiOutlinePlus } from 'react-icons/ai';
import { RiThumbUpFill, RiThumbDownFill } from 'react-icons/ri';
import { BiChevronDown } from 'react-icons/bi';
import { BsCheck } from 'react-icons/bs';
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '../utils/firebase-config';
import { useDispatch } from 'react-redux';
import { removeMovieFromLiked } from '../store';
import video from '../assets/video.mp4';

export default React.memo(function Card({ index, movieData, isLiked = false }) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [isHovered, setIsHovered] = useState(false);
	const [email, setEmail] = useState(undefined);
	const [video, setVideo] = useState('');

	const fetchVideo = async () => {
		const { data } = await axios.get(
			`https://api.themoviedb.org/3/movie/${movieData.id}/videos?api_key=60360f23d9aa85ad94eae8e86e0d9aad&language=en-US`
		);
		if (data) {
			if (data.results.length > 0) {
				setVideo(data.results[0]?.key);
			}
		}
	};

	useEffect(() => {
		if (isHovered) fetchVideo();
		// eslint-disable-next-line
	}, [isHovered]);

	onAuthStateChanged(firebaseAuth, (currentUser) => {
		if (currentUser) {
			setEmail(currentUser.email);
		} else navigate('/login');
	});

	const addToList = async () => {
		try {
			await axios.post(
				'https://netflix-clone-dong47.herokuapp.com/api/user/add',
				{
					email,
					data: movieData,
				}
			);
		} catch (error) {
			console.log(error);
		}
	};

	function watchVideo() {
		video.localeCompare('') === 0
			? navigate('/player')
			: window.open(`https://www.youtube.com/watch?v=${video}`, '_blank');
	}

	return (
		<Container
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<img
				src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
				alt="card"
				onClick={() => watchVideo()}
			/>

			{isHovered && (
				<div className="hover">
					<div className="image-video-container">
						<img
							src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
							alt="card"
							onClick={() => watchVideo()}
						/>
						<video
							// src={`https://www.youtube.com/watch?v=${video}`}
							autoPlay={true}
							loop
							muted
							onClick={() => watchVideo()}
						/>
					</div>
					<div className="info-container flex column">
						<h3 className="name" onClick={() => watchVideo()}>
							{movieData.name}
						</h3>
						<div className="icons flex j-between">
							<div className="controls flex">
								<IoPlayCircleSharp
									title="Play"
									onClick={() => watchVideo()}
								/>
								<RiThumbUpFill title="Like" />
								<RiThumbDownFill title="Dislike" />
								{isLiked ? (
									<BsCheck
										title="Remove from List"
										onClick={() =>
											dispatch(
												removeMovieFromLiked({
													movieId: movieData.id,
													email,
												})
											)
										}
									/>
								) : (
									<AiOutlinePlus
										title="Add to my list"
										onClick={addToList}
									/>
								)}
							</div>
							<div className="info">
								<BiChevronDown title="More Info" />
							</div>
						</div>
						<div className="genres flex">
							<ul className="flex">
								{movieData.genres.map((genre) => (
									<li key={genre}>{genre}</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			)}
		</Container>
	);
});

const Container = styled.div`
	max-width: 230px;
	width: 230px;
	height: 100%;
	cursor: pointer;
	position: relative;
	img {
		border-radius: 0.2rem;
		width: 100%;
		height: 100%;
		z-index: 10;
	}
	.hover {
		z-index: 99;
		height: max-content;
		width: 20rem;
		position: absolute;
		top: -18vh;
		left: 0;
		border-radius: 0.3rem;
		box-shadow: rgba(0, 0, 0, 0.75) 0px 3px 10px;
		background-color: #181818;
		transition: 0.3s ease-in-out;
		.image-video-container {
			position: relative;
			height: 140px;
			img {
				width: 100%;
				height: 140px;
				object-fit: cover;
				border-radius: 0.3rem;
				top: 0;
				z-index: 4;
				position: absolute;
			}
			video {
				width: 100%;
				height: 140px;
				object-fit: cover;
				border-radius: 0.3rem;
				top: 0;
				z-index: 5;
				position: absolute;
			}
		}
		.info-container {
			padding: 1rem;
			gap: 0.5rem;
		}
		.icons {
			.controls {
				display: flex;
				gap: 1rem;
			}
			svg {
				font-size: 2rem;
				cursor: pointer;
				transition: 0.3s ease-in-out;
				&:hover {
					color: #b8b8b8;
				}
			}
		}
		.genres {
			ul {
				gap: 1rem;
				li {
					padding-right: 0.7rem;
					&:first-of-type {
						list-style-type: none;
					}
				}
			}
		}
	}
`;
