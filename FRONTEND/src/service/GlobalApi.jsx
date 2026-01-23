// import axios from "axios";

// export const GetPlaceDetails = async () => {
//   try {
//     const response = await axios.get(
//       "https://places.googleapis.com/v1/places:searchText",
//       {
//         headers: {
//           Authorization: `Bearer AIzaSyDGfDWOQ0vk1Z_4-Wbh0-J3XgzH917ELIQ`,
//           // Include other headers if necessary
//         },
//       }
//     );
//     console.log(response.data);
//   } catch (error) {
//     console.error(
//       "Error fetching data:",
//       error.response ? error.response.data : error.message
//     );
//   }
// };

import axios from "axios";

const BASE_URL = "https://places.googleapis.com/v1/places:searchText";

/**
 * Google Places Text Search API
 * @param {Object} data - request payload
 * @returns {Promise}
 */
export const GetPlaceDetails = (data) => {
  return axios.post(BASE_URL, data, {
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_PLACE_API_KEY,
      "X-Goog-FieldMask": "places.id,places.displayName,places.photos"
    }
  });
};