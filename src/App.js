import React, { useState } from "react";
import ReactMapboxGl from "react-mapbox-gl";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import UserFeatures from "./UserFeatures";
import "./App.css";

const client = new ApolloClient({
  uri: "http://localhost:8080/graphql"
});

const mapConfig = {
  style: "mapbox://styles/mapbox/outdoors-v10",
  containerStyle: {
    height: "100vh",
    width: "100vw"
  },
  center: { lat: 30.266666, lng: -97.73333 },
  flyToOptions: {
    speed: 0.8
  }
};

const Map = ReactMapboxGl({
  accessToken: process.env.REACT_APP_MAPBOX_TOKEN
});

function App() {
  const [mapState, setMapState] = useState({ zoom: [6], loaded: false });
  const [bbox, setBBox] = useState({
    topLeft: {
      lat: null,
      lon: null
    },
    bottomRight: {
      lat: null,
      lon: null
    }
  });

  const mapBoundsToBbox = bounds => {
    const northWest = bounds.getNorthWest();
    const southEast = bounds.getSouthEast();
    const topLeft = {
      lat: `${northWest.lat}`,
      lon: `${northWest.lng}`
    };
    const bottomRight = {
      lat: `${southEast.lat}`,
      lon: `${southEast.lng}`
    };

    return {
      topLeft,
      bottomRight
    };
  };

  const moveEnd = map => {
    const bbox = mapBoundsToBbox(map.getBounds());
    setBBox(bbox);
  };

  const onLoad = () => {
    setMapState({ zoom: [10], loaded: true });
  };

  return (
    <div className="App">
      <ApolloProvider client={client}>
        <Map
          {...mapConfig}
          zoom={mapState.zoom}
          onMoveEnd={moveEnd}
          onStyleLoad={onLoad}
        >
          {mapState.loaded && bbox.topLeft.lat && <UserFeatures bbox={bbox} />}
        </Map>
      </ApolloProvider>
    </div>
  );
}

export default App;
