import React, { Component } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Container, Grid, Header, Button} from 'semantic-ui-react'

class App extends Component {
  state = {
    unit: 'c',
    currentDate: '',
    currentTemp: '',
    minimumTemp: '',
    maximumTemp: '',
    currentLocation: '',
    latitude: '',
    longitudeL: '',
  }

  handleUnitChange = (value) => {
    return this.setState({
      unit: value
    });

  }

  handleGetWeatherData = async () => {
    const api = 'https://api.darksky.net/forecast'
    const API_KEY = 'a177f8481c31fa96c3f95ad4f4f84610'
    if (navigator.geolocation) {
      await navigator.geolocation.getCurrentPosition(this.handlePosition);
    } else {
      console.warn("Geolocation is not supported by this browser.")
    }
    const headers = {
      'Accept': 'application/json',
    }
    const { latitude, longitude } = this.state
    fetch(`${api}/${API_KEY}/${latitude},${longitude}`, { headers })
      .then(res => res.json())
      .catch(err => {
        console.warn(err);
        return {
          success: false,
          message: err
        };
      })
  }
  handlePosition = (position) => {
    return this.setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    })
  }

  componentDidMount = () => {
    setInterval(async () => {
      const weatherData = await this.handleGetWeatherData()
      console.log(weatherData);
    }, 5000);
  }

  render(){
    const { unit } = this.state

    return (
      <Container>
        <Grid stackable>
          <Grid.Row columns={3}><br/></Grid.Row>
          <Grid.Row columns={3}>
            <Grid.Column width={4}>
              <Header as='h2'>INSTAWEATHER</Header>
            </Grid.Column>
            <Grid.Column width={8}>

            </Grid.Column>
            <Grid.Column width={4}>
              <Button >
              C
              </Button>
              |
              <Button>
              F
              </Button>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row columns={3}>
            <Grid.Column width={4}>
              <Header as='h2'>Smart Village</Header>
              <Header as='h4'>Friday 20, 2022</Header>
              <br/>
              <br/>
              <Header as='h3'>Cloudy</Header>
            </Grid.Column>
            <Grid.Column width={8}>

            </Grid.Column>
            <Grid.Column width={4}>
              <Header as='h1'>72°</Header>
              <Header as='h3'>64°/84°</Header>
              <Header as='h4'>Cloudy all the Day</Header>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }

}



export default App
