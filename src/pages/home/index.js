import React, { useState, useEffect } from 'react'
import { Tabs, Icon, Table, notification } from 'antd'

import './style.css'

const { TabPane } = Tabs
const Paho = require('paho-mqtt')
const MQTT_CLIENT = new Paho.Client("tailor.cloudmqtt.com", 36410, 'client_' + parseInt(Math.random() * 100, 10));

const goalImg = require('../../images/ball.png')
const audioSrc = require('../../audios/goal.mp3')

const request = new XMLHttpRequest()

const COMPETITIONS = [
    'BSA', 'PL', 'SA', 'BL1', 'FL1', 'PD'
]

const COUNTRY_CODES = {
    "Brazil": { "code": "br", "name": "Brasileirão" },
    "England": { "code": "gb", "name": "Inglês" },
    "France": { "code": "fr", "name": "Francês" },
    "Germany": { "code": "de", "name": "Alemão" },
    "Italy": { "code": "it", "name": "Italiano" },
    "Spain": { "code": "es", "name": "Espanhol" }
}

const tableColumns = [
    {
      title: 'Home Team',
      dataIndex: 'homeTeam',
      key: 'homeTeam',
      align: 'right'
    },
    {
      title: 'Home Score',
      dataIndex: 'homeScore',
      key: 'homeScore',
      width: "5%"
    },
    {
        title: 'dash',
        dataIndex: 'dash',
        key: 'dash',
        width: "5%"
      },
    {
      title: 'Away Score',
      dataIndex: 'awayScore',
      key: 'awayScore',
      width: "5%"
    },
    {
        title: 'Away Team',
        dataIndex: 'awayTeam',
        key: 'awayTeam',
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
      }
  ]

const getCompetitionMatches = (matches) => {
    var partial = []

    for (var i = 0; i < matches.length; i++){
        partial.push({
            key: matches[i].id,
            homeTeam: matches[i].homeTeam.name,
            homeScore: matches[i].score.fullTime.homeTeam != null ? matches[i].score.fullTime.homeTeam : " ",
            dash: "-",
            awayScore: matches[i].score.fullTime.awayTeam != null ? matches[i].score.fullTime.awayTeam : " ",
            awayTeam: matches[i].awayTeam.name,
            date: matches[i].utcDate
        })
    }

    return partial
}

const Home = () => {
    const [competitions, setCompetitions] = useState([])
    const [filteredCompetitions, setFilteredCompetitions] = useState([])
    const [games, setGames] = useState([])
    const [favorites, setFavorites] = useState([])
    const [favsRender, setFavsRender] = useState(0)
    const [liveMatches, setLiveMatches] = useState([])
    const [currentTab, setCurrentTab] = useState("")
    const [flag, setFlag] = useState(false)
    const [goal, setGoal] = useState(false)

    const connectBroker = () => {
        const onConnect = () => {
            console.log('conectado')
    
        }
        
        const onConnectionLost = responseObject => {
            console.log({ responseObject })
        }
        
        const onMessageArrived = message => {
            for (var i = 0; i < favorites.length; i++){
                var splittedMessage = message.topic.split(" ")
                if (favorites[i].key.toString() === splittedMessage[0]){
                    if (splittedMessage[1] === "Home"){
                        console.log(message.topic + " - " + message.payloadString)

                        if(favorites[i].homeScore !== parseInt(message.payloadString)){
                            favorites[i].homeScore = parseInt(message.payloadString)

                            if(parseInt(message.payloadString) !== 0){
                                setGoal(true)
                            }
                            
                        }
                    } else if (splittedMessage[1] === "Away"){
                        console.log(message.topic + " - " + message.payloadString)

                        if(favorites[i].awayScore !== parseInt(message.payloadString)){
                            favorites[i].awayScore = parseInt(message.payloadString)
                            
                            if(parseInt(message.payloadString) !== 0){
                                setGoal(true)
                            }
                        }
                    }
                }
            }
        }
    
        MQTT_CLIENT.onConnectionLost = onConnectionLost
        MQTT_CLIENT.onMessageArrived = onMessageArrived
        MQTT_CLIENT.connect({
            onSuccess: onConnect,
            useSSL: true,
            userName: "ietviunn",
            password: "Of4PmWrlNCip"
        })
    }

    useEffect(() => {
        console.log("?????")
        if(goal){
            var x = document.getElementById("goalTest")
            x.play()
            notification.open({
                message: 'GOOOOOOOOOOOOOOOOOOL!!!',
                icon: <img src = {goalImg} className = "ball-icon" />
          });
          setGoal(false)
        }
    }, [goal])

    useEffect(() => {
        connectBroker()
        request.open('GET', 'https://api.football-data.org/v2/competitions/', true)
        request.setRequestHeader("X-Auth-Token", "c094845cdb204ca6a7bedb7e2129a0a9")

        request.onreadystatechange = function() {
            if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                setCompetitions(JSON.parse(this.response).competitions)
            }
        }

        request.send()
    }, [])

    useEffect(() => {
        const partial = []

        if(competitions.length > 0) {
            for (var i = 0; i < competitions.length; i++) {
                
                if (COMPETITIONS.includes(competitions[i].code)) {
                    partial.push(competitions[i])
                }
            }
            partial.splice(3, 0, "fav")
        }

        setFilteredCompetitions(partial)
    }, [competitions])

    useEffect(() => {
        const partial = []

        if(filteredCompetitions.length > 0) {

            (function loop(i, length) {
                if (i >= length){ 
                    setGames(partial)
                    return 
                }
                
                if (i !== 3) {
                    request.open('GET', `https://api.football-data.org/v2/competitions/${filteredCompetitions[i].code}/matches`, true)
                    request.setRequestHeader("X-Auth-Token", "c094845cdb204ca6a7bedb7e2129a0a9")

                    request.onreadystatechange = function() {
                        if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                            const value = JSON.parse(this.response)
                            
                            partial.push(value)
                            console.log("foi")
                            loop(i + 1, length)
                        }
                    }

                    request.send()
                } else {
                    loop(i + 1, length)
                }

            }) (0, filteredCompetitions.length)
        }

        
    }, [filteredCompetitions])

    useEffect(() => {
        if(currentTab === "fav"){
            setTimeout(function loop() {
                request.open('GET', 'https://api.football-data.org/v2/matches?status=LIVE', true)
                request.setRequestHeader("X-Auth-Token", "c094845cdb204ca6a7bedb7e2129a0a9")
        
                request.onreadystatechange = function() {
                    if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                        var data = JSON.parse(this.response)
                        setLiveMatches(data)
                    }
                }

    
                request.send()
                setFlag(!flag)
            }, 15000)
        }
    }, [currentTab, flag])

    useEffect(() => {
        /* publish */
        if(favorites.length > 0) {
            for (var j = 0; j < favorites.length; j++){
                for (var i = 0; i < liveMatches.matches.length; i++){
                    const match = liveMatches.matches[i]
                    if(match.id === favorites[j].key){

                        var messageAway = new Paho.Message(match.score.fullTime.awayTeam.toString())
                        var messageHome = new Paho.Message(match.score.fullTime.homeTeam.toString())

                        messageAway.destinationName = match.id.toString() + " Away"
                        MQTT_CLIENT.send(messageAway)

                        messageHome.destinationName = match.id.toString() + " Home"
                        MQTT_CLIENT.send(messageHome)

                    }
                }
            }
        }

        /* subscribe */
        if(favorites.length > 0) {
            for (var j = 0; j < favorites.length; j++){
                for (var i = 0; i < liveMatches.matches.length; i++){
                    const match = liveMatches.matches[i]
                    if(match.id === favorites[j].key){

                        var awayTopic = match.id.toString() + " Away"
                        var homeTopic = match.id.toString() + " Home"

                        MQTT_CLIENT.subscribe(awayTopic)
                        MQTT_CLIENT.subscribe(homeTopic)

                    }
                }
            }
            
        }
        
    }, [liveMatches])
    
    const rowSelection = {
        columnWidth: "5%",
        onSelect: (record, selected, selectedRows) => {
            var favs = favorites
            if(selected){
                favs.push(record)
            } else {
                for(var i = 0; i < favs.length; i++){
                    if (record.key === favs[i].key){
                        favs.splice(i,1)
                        break
                    }
                }
            }
            setFavorites(favs)
            setFavsRender(Math.random())
        }
      }

    const listenFavs = (key) => {
        setCurrentTab(key)
    }

    return (
        <div>
            <audio id="goalTest">
                <source src={audioSrc} type="audio/mpeg" /> 
            </audio>
            <Tabs className = "main-tab" onChange = {listenFavs}>
                {   
                    filteredCompetitions.map( c => {
                        if (c === "fav"){
                            return(
                                <TabPane 
                                    key = {c}
                                    tab = {
                                        <div className="fav">
                                            <Icon type = "star" className = "fav-icon"/> <br/>
                                            Favoritos ({favorites.length})
                                        </div>
                                    }
                                >
                                {
                                    <Table
                                        showHeader = {false}
                                        size = "small"
                                        key = "favs" 
                                        columns = {tableColumns} 
                                        dataSource = {favorites}
                                        pagination = {false}
                                    />
                                }    
                                
                                </TabPane>
                            )
                        } else {
                            return (
                                <TabPane 
                                    key = {c.code}
                                    tab = {
                                            <div>
                                                <img src = { `https://www.countryflags.io/${COUNTRY_CODES[c.area.name].code}/flat/24.png` }/><br/>
                                                {COUNTRY_CODES[c.area.name].name}
                                            </div>
                                        } 
                                    >
                                    {
                                        games.map(gs => {
                                            if (gs.competition.code === c.code){
                                                const matches = getCompetitionMatches(gs.matches)
                                                return (
                                                    <Table
                                                        rowSelection={rowSelection}
                                                        showHeader = {false}
                                                        size = "small"
                                                        scroll = {{ y: '27vw' }}
                                                        key = {c.code} 
                                                        columns = {tableColumns} 
                                                        dataSource = {matches}
                                                        pagination = {{
                                                            position: 'top',
                                                            // onChange: function() { console.log("oi")}
                                                        }}
                                                    />
                                                )
                                            }
                                        })
                                    }
                                </TabPane>
                            )
                        }
                        
                    })
                }
                
            </Tabs>
        </div>
        

    );
};

export default Home;