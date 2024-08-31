const axios = require('axios');

exports.homeRoutes = async (req, res) => {
    try {
        const response = await axios.get('http://localhost:8002/thailottery/api/admin/dashboard');
        res.render('index', { data: response.data });
    } catch (error) {
        console.error(error);
        res.render('data', { title: 'Data Page', data: [] });
    }
}
