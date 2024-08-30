const axios = require('axios');

exports.homeRoutes = (req, res) => {
    // Make a get request to /api/ads
    axios.get('http://localhost:8002/thailottery/api/admin/dashboard')

        .then(function (response) {
            // console.log(response.data);
            res.render('index', { data: response.data });
        }).catch(error => {
            console.error('Error fetching data:', error);
            res.render('user', { data: null, error: 'Failed to fetch data' });
        })
}
