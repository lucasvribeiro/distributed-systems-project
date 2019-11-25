# Projeto de Sistemas Distribuídos

## Tema e Requisitos
Sistema web para visualização de jogos de futebol (jogos passados, ao vivo e próximos jogos) separados por campeonatos.
Também será possível marcar como **favorito** um determinado jogo e receber notificações de gols durante a partida.

Haverá uma tela para visualização dos jogos. Os jogos serão separados por competição e dentro de cada competição, separados por rodada.
Desta forma, um jogo poderá ser *favoritado*, aparecendo no menu de favoritos.

OBS: Por razões de limitação da api utilizada para coletar as informações dos jogos, foram consideradas para o escopo desta aplicação, jogos das seguintes competições: Brasileirão, Campeonato Inglês, Espanhol, Italiano, Alemão e Francês.

## Autor
A equipe de desenvolvimento deste projeto é formada apenas pelo aluno Lucas Vinicius Ribeiro.

## Arquitetura e Funcionalidades
Ao favoritar um jogo, o usuário passa a ser inscrito no tópico daquele jogo que estão sendo publicadas em um broker. Para isso, foi utilizado o CloudMQTT como broker. A escolha do mesmo se deu por conta do conhecimento prévio do autor sobre como utilizar tal protocolo/broker.

## Tecnologias/API
Para desenvolvimento, foi utilizado os frameworks ReactJS e Node.

Para obter as informações dos jogos foi utilizada a API **[football-data](https://www.football-data.org/)**.

## [Exemplo de funcionamento](https://drive.google.com/open?id=1-VcM325butY1-deP4rcvr40j-DEaxt7J).
