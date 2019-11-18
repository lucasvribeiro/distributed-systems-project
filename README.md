# Projeto de Sistemas Distribuídos

## Tema e Requisitos
Sistema web para visualização de jogos de futebol (jogos passados, ao vivo e próximos jogos).
Também será possível marcar como favorito um determinado jogo e receber notificações sobre eventos acontecidos na partida (início, gols e fim de jogo/placar final).

Haverá uma tela para visualização dos jogos. Os jogos serão separados por competição e dentro de cada competição, separados por rodada.
Desta forma, um jogo poderá ser favoritado, aparecendo no menu de favoritos.

OBS: A título de simplificação, serão utilizadas competições específicas e rodadas específicas.

## Autor
A equipe de desenvolvimento deste projeto é formada apenas pelo aluno Lucas Vinicius Ribeiro.

## Tecnologias/API
Para desenvolvimento, será utilizado os frameworks React e Node.

Para obter as informações dos jogos será utilizada a API **[football-data](https://www.football-data.org/)**.
Além disso, 

## Arquitetura e Funcionalidades
Ao favoritar um jogo, o usuário passa a ser inscrito no tópico daquele jogo que estão sendo publicadas em um broker.
