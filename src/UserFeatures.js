import React from "react";
import { Layer, Feature } from "react-mapbox-gl";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

const USER_FEATURES = gql`
  query($bbox: BBox) {
    geoSearch(bbox: $bbox) {
      users {
        hits {
          name
          location {
            lat
            lon
          }
        }
        total
      }
    }
  }
`;

function UserFeatures({ bbox }) {
  const { loading, error, data } = useQuery(USER_FEATURES, {
    variables: { bbox }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Layer
      type="symbol"
      id="users"
      layout={{
        "icon-image": "circle-15",
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
        "text-allow-overlap": true,
        "text-ignore-placement": true
      }}
    >
      {data.geoSearch.users.hits.map(user => (
        <Feature
          key={user.name}
          coordinates={[user.location.lon, user.location.lat]}
        />
      ))}
    </Layer>
  );
}

export default UserFeatures;
