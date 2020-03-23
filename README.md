# Soccer Games

## Description

This project was developed for the discipline of distributed systems.

**Soccer Games** is a web system for listing football matches (past, live and upcoming matches) and it's also possible to **favorite** a game and receive notifications of goals during the match.

NOTE: For reasons of limits from the application used to collect information about games, were considered the following competitions: Brasileirão, English Championship, Spanish, Italian, German and French.

## Architecture and Features

When a game is a favorite, the user passes a registration on the topic being registered with a broker. For this, CloudMQTT was used as a broker. The choice was made due to the author's prior knowledge on how to use the protocol / broker.

<p align="center">
  <img src="arquitetura.png"/>
</p>

## Technologies/API

The technologies used were: ReactJS, NodeJS, HTML5 and CSS3.
For getting game information, it was used the **[football-data](https://www.football-data.org/)** API.


**[⚽ Access the Soccer Games](https://soccergames.netlify.com/)**
