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

exports.userRoutes = async (req, res) => {
    try {
        const response = await axios.get('http://localhost:8002/thailottery/api/admin/users');
        res.render('user', { user: response.data.data });
    } catch (error) {
        console.log(error);
        res.render('data', { title: 'Data Page', data: [] });
    }
}

exports.userDetails = async (req, res) => {
    try {
        res.render("userdetails");
    } catch (error) {
        console.log(error);
    }
}

