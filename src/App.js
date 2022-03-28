import React, { Component } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Container, Grid, Header, Button} from 'semantic-ui-react'

class App extends Component {
  state = {
    unit: 'c',
    summary: '',
    currentDate: '',
    currentTemp: '',
    minimumTemp: '',
    maximumTemp: '',
    currentLocation: '',
    latitude: '',
    longitudeL: '',
    description,
  }

  handleUnitChange = (value) => {
    const { unit } = this.state
    if (value === 'c' && unit === 'f') {
      return this.setState((prevState) => {
        return {
          ...prevState,
          currentTemp: (prevState.currentTemp - 32)*5/9,
          maximumTemp: (prevState.maximumTemp - 32)*5/9,
          minimumTemp: (prevState.minimumTemp - 32)*5/9,
          unit: value,
        };
      });
    }
    if (value === 'f' && unit === 'c') {
      return this.setState((prevState) => {
        return {
          ...prevState,
          currentTemp: (prevState.currentTemp * 9/5)+32,
          maximumTemp: (prevState.maximumTemp * 9/5)+32,
          minimumTemp: (prevState.minimumTemp * 9/5)+32,
          unit: value,
        };
      });
    }

  }

  handleGetWeatherData = async () => {
    const api = "https://api.openweathermap.org/data/2.5/weather?"
    const API_KEY = "2d1745756e1f2fc74430bffdf7be77f3"
    const { latitude, longitude } = this.state
    if (latitude && longitude) {
      return await (
        fetch(`${api}lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
          .then(res => res.json())
          .catch(err => {
            console.warn(err);
            return {
              success: false,
              message: err
            };
          })
      )
    }
    else {
      return {};
    }
  }

  handleGetCurrentCity = async () => {
    const api = "http://api.openweathermap.org/geo/1.0/reverse?"
    const API_KEY = "2d1745756e1f2fc74430bffdf7be77f3"
    const { latitude, longitude } = this.state
    if (latitude && longitude) {
      return(
        await fetch(`${api}lat=${latitude}&lon=${longitude}&limit=5&appid=${API_KEY}`)
          .then(res => res.json())
          .catch(err => {
            console.warn(err);
            return {
              success: false,
              message: err
            };
          })
      )
    }
    else {
      return [{}];
    }


  }

  handlePosition = async (position) => {
    return await this.setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    })
  }

  componentDidMount = async() => {
    let cityData = {}
    setInterval(async () => {
      //get location first
      if (navigator.geolocation) {
        await navigator.geolocation.getCurrentPosition(this.handlePosition);
        // get current Get Current City
        cityData = await this.handleGetCurrentCity()
      } else {
        console.warn("Geolocation is not supported by this browser.")
      }
      const currentLocation = cityData? cityData[0].name : 'loading'
      // get weather data and keep updating every minute
      const weatherData = await this.handleGetWeatherData()
        if (weatherData.main) {
          console.log('weatherData', weatherData);
          const summary = weatherData.weather[0].main
          const description = weatherData.weather[0].description
          const currentTemp = weatherData.main.temp
          const minimumTemp = weatherData.main.temp_min
          const maximumTemp = weatherData.main.temp_max
          return await this.setState({
            currentTemp,
            maximumTemp,
            minimumTemp,
            currentLocation,
            summary,
            description
          });
        }
    }, 6000);
  }

  render(){
    const { unit, minimumTemp, maximumTemp, currentTemp, summary, currentLocation } = this.state
    const currentDate = new Date()
    const dateString = currentDate.toString()
    const dateArray = dateString.split(" ");

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
            <Button.Group floated='left'>
              <Button onClick = {() => this.handleUnitChange('c')}>C</Button>
              <Button onClick = {() => this.handleUnitChange('f')}>F</Button>
            </Button.Group>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
          </Grid.Row>

          <Grid.Row columns={3}>
            <Grid.Column width={4}>
              <Header as='h2'>{currentLocation}</Header>
              <Header as='h4'>{dateArray[0]} {dateArray[2]} {dateArray[3]}</Header>
              <br/>
              <br/>
              <Header as='h3'>{summary}</Header>
            </Grid.Column>
            <Grid.Column width={8}>

            </Grid.Column>
            <Grid.Column width={4}>
              <Header as='h1'>{currentTemp}°</Header>
              <Header as='h3'>{minimumTemp}°/{maximumTemp}°</Header>
              <Header as='h4'>{description}</Header>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }

}



export default App
