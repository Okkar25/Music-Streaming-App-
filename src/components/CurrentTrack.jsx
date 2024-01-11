import axios from "axios";
import React, { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { reducerCases } from "../utils/Constants";
import { useStateProvider } from "../utils/StateProvider";

const CurrentTrack = ({ spin }) => {
  const [{ token, currentlyPlaying, playerState }, dispatch] =
    useStateProvider();

  useEffect(() => {
    const getCurrentTrack = async () => {
      const response = await axios.get(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );

      //   console.log(response.data);

      if (response.data !== "") {
        const { item } = response.data;
        const currentlyPlaying = {
          id: item.id,
          name: item.name,
          artists: item.artists.map((artist) => artist.name),
          image: item.album.images[1].url,
          isPlaying: response.data.is_playing,
        };

        dispatch({
          type: reducerCases.SET_PLAYING,
          payload: { currentlyPlaying },
        });
      }
    };

    getCurrentTrack();
  }, [token, dispatch, currentlyPlaying]); // currentlyPlaying shows the song playing at  the moment

  //   console.log(currentlyPlaying);

  return (
    <Container spin={spin}>
      {currentlyPlaying && (
        <div className="track">
          <div className="track__image">
            <img src={currentlyPlaying.image} alt="currentlyPlaying" />
          </div>

          <div className="track__info">
            <h4>{currentlyPlaying.name}</h4>
            <h5>{currentlyPlaying.artists.join(", ")}</h5>
          </div>
        </div>
      )}
    </Container>
  );
};

export default CurrentTrack;

const rotate = keyframes`
from {
    transform: rotate(0deg);
    }

 to {
    transform: rotate(360deg);
 }
`;

const Container = styled.div`
  .track {
    display: flex;
    align-items: center;
    gap: 1rem;
    user-select: none;

    .track__image {
      img {
        height: 80px;
        /* border-radius: 10px; */
        border-radius: 50%;
        animation: ${rotate} infinite 8s linear;
        animation-play-state: ${({ spin }) => (spin ? "running" : "paused")};
      }
    }

    .track__info {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;

      h4 {
        color: white;
        margin: 0;
      }
      h5 {
        color: #b3b3b3;
        margin: 0;
      }
    }
  }
`;