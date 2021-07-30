import axios from "axios";
import querystring from 'querystring';
export default {
  getGit(request, limit) {
    request = querystring.stringify(request)
    console.log(request)
    axios.get(
      `http://api.giphy.com/v1/gifs/search?q=${request}&api_key=Zn3OAPIUEf5aGTh6D7E5ME0xHQkRokqT&limit=${limit}`
    )
    .then ((res) => {
      
      return res;
    })
  }
};
